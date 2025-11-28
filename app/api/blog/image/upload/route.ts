import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import fs from 'fs';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';
import sharp from 'sharp';

function sanitizeFilename(name: string): string {
  return name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '').toLowerCase();
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const option = formData.get('option') as string | null;

  if(!file) return NextResponse.json({error: 'No file uploaded'}, {status: 400});

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const original = file.name;
  const ext = path.extname(original).toLowerCase() || '.jpg';

  const fileName = `${Date.now()}-image${ext}`;

  let processed = sharp(buffer).rotate();

  if(option === '500') processed = processed.resize({width: 500});
  if(option === '700') processed = processed.resize({width: 700});
  if(option === 'square') processed = processed.resize(800, 800, {fit: 'cover'});

  const output = await processed.toBuffer();

  if(process.env.NODE_ENV === 'development') {
    const dir = path.join(process.cwd(), 'public', 'uploads');
    if(!fs.existsSync(dir)) await mkdir(dir, {recursive: true});

    const filepath = path.join(dir, fileName);
    await writeFile(filepath, output);

    return NextResponse.json({url: `/uploads/${fileName}`});
  }

  const token = process.env.GITHUB_TOKEN ?? '';
  const owner = process.env.GITHUB_OWNER ?? '';
  const repo = process.env.GITHUB_REPO ?? '';
  const branch = process.env.GITHUB_BRANCH ?? 'main';

  const octokit = new Octokit({auth: token});
  const gitPath = `public/images/${fileName}`;

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: gitPath,
    message: `Image upload: ${fileName}`,
    content: output.toString('base64'),
    branch,
  });

  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/public/images/${fileName}`;
  return NextResponse.json({url});
}
