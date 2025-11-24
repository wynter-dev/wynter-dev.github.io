'use server';

import fs from 'fs';
import path from 'path';
import {Octokit} from 'octokit';
import {RequestError} from '@octokit/request-error';

type CreatePostParams = {
  title: string;
  content: string;
  tags: string[];
  depth1: string;
  depth2?: string;
  depth3?: string | null;
};

export async function createPost({title, content, tags, depth1, depth2, depth3}: CreatePostParams) {
  // slug 생성
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ㄱ-ㅎ가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  // SEO description 생성
  const descriptionText = generateDescription(content);

  // frontmatter
  const mdx = `---
title: "${title}"
description: "${descriptionText}"
date: "${new Date().toISOString().split('T')[0]}"
category: ["${depth1}", "${depth2}"${depth3 ? `, "${depth3}"` : ''}]
tags: [${tags.map((t) => `"${t}"`).join(', ')}]
---

${content}
`;

  // depth 경로 구성
  const categoryPath = [depth1, depth2, depth3].filter(Boolean).join('/');
  const filePath = `src/content/posts/${categoryPath}/${slug}.mdx`;
  const localPath = path.join(process.cwd(), filePath);

  // -----------------------------------------
  // 1) 개발환경: 로컬 파일 생성
  // -----------------------------------------
  if (process.env.NODE_ENV === 'development') {
    fs.mkdirSync(path.dirname(localPath), {recursive: true});
    fs.writeFileSync(localPath, mdx, {encoding: 'utf8'});

    console.log(`Local file created: ${localPath}`);
    return {slug, categoryPath};
  }

  // -----------------------------------------
  // 2) Production: GitHub에 파일 업로드
  // -----------------------------------------
  const token = process.env.GITHUB_TOKEN!;
  const owner = process.env.GITHUB_OWNER!;
  const repo = process.env.GITHUB_REPO!;
  const branch = process.env.GITHUB_BRANCH ?? 'main';

  const octokit = new Octokit({auth: token});

  // 파일 존재 여부 검사 (sha 필요)
  let sha: string | undefined = undefined;

  try {
    const existingFile = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: branch,
    });

    if (!Array.isArray(existingFile.data)) {
      sha = existingFile.data.sha;
    }
  } catch (err) {
    if (err instanceof RequestError) {
      if (err.status !== 404) throw err;
    } else {
      throw err;
    }
  }

  // GitHub 에 폴더 없으면 자동 생성되지 않으므로 createOrUpdate 호출로 해결됨
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: sha ? `Update post: ${slug}` : `Create post: ${slug}`,
    content: Buffer.from(mdx).toString('base64'),
    branch,
    sha,
  });

  return {slug, categoryPath};
}

// ---------------------------------------------
// Description Builder
// ---------------------------------------------
function generateDescription(content: string): string {
  let text = content;

  text = text.replace(/!\[.*?\]\(.*?\)/g, '');            // 이미지 제거
  text = text.replace(/```[\s\S]*?```/g, '');             // 코드블록 제거
  text = text.replace(/^#+\s.+$/gm, '');                  // 헤더 제거
  text = text.replace(/`([^`]*)`/g, '$1');                // inline code
  text = text.replace(/\[([^\]]+)]\([^)]+\)/g, '$1');     // 링크 제거
  text = text.replace(/[*_>~\-]/g, '');                   // md 스타일 제거
  text = text.replace(/\s+/g, ' ').trim();                // 공백 정리

  if (text.length > 160) return text.substring(0, 157) + '...';
  return text;
}
