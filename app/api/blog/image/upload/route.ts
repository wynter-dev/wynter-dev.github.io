import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import fs from 'fs';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';
import sharp from 'sharp';

function sanitizeFilename(name: string): string {
  return name
    .replace(/\s+/g, '-')           // 공백 → 하이픈
    .replace(/[^a-zA-Z0-9._-]/g, '') // 한글/특수문자 제거
    .toLowerCase();
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if(!file) {
    return NextResponse.json({error: 'No file uploaded'}, {status: 400});
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const original = file.name;
  const ext = path.extname(original).toLowerCase() || '.jpg';
  const safeBase = sanitizeFilename(path.basename(original, ext));

  const fileName = `${Date.now()}-${safeBase || 'image'}${ext}`;

  const output = await sharp(buffer).rotate().toBuffer();

  if(process.env.NODE_ENV === 'development') {
    const now = new Date();
    const folderName = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-'); // YYYY-MM-DD

    const dir = path.join(process.cwd(), 'public', 'uploads', folderName);
    if(!fs.existsSync(dir)) await mkdir(dir, {recursive: true});

    const filepath = path.join(dir, fileName);
    await writeFile(filepath, output);

    return NextResponse.json({
      url: `/uploads/${folderName}/${fileName}`,
    });
  }

  const token = process.env.GITHUB_TOKEN ?? '';
  const owner = process.env.GITHUB_OWNER ?? '';
  const repo = process.env.GITHUB_REPO ?? '';
  const branch = process.env.GITHUB_BRANCH ?? 'main';

  const now = new Date();
  const folderName = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');

  const octokit = new Octokit({auth: token});

  const gitPath = `public/images/${folderName}/${fileName}`;

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: gitPath,
    message: `Image upload: ${fileName}`,
    content: output.toString('base64'),
    branch,
  });

  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/public/images/${folderName}/${fileName}`;

  return NextResponse.json({url});
}
