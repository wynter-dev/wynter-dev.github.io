'use server';

import fs from 'fs';
import path from 'path';
import { Octokit } from 'octokit';
import { RequestError } from '@octokit/request-error';

type CreatePostParams = {
  title: string;
  content: string;
  tags: string[];
};

export async function createPost({
                                   title,
                                   content,
                                   tags,
                                 }: CreatePostParams) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ㄱ-ㅎ가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const descriptionText = generateDescription(content);

  const mdx = `---
title: "${title}"
description: |
${descriptionText}
date: "${new Date().toISOString().split('T')[0]}"
tags: [${tags.map((t) => `"${t}"`).join(', ')}]
---

${content}
`;

  const filePath = `src/content/posts/${slug}.mdx`;
  const localPath = path.join(process.cwd(), filePath);

  if(process.env.NODE_ENV === 'development') {
    fs.writeFileSync(localPath, mdx, {encoding: 'utf8'});
    console.log(`📝 Local file created: ${localPath}`);
    return {slug};
  }

  const token = process.env.GITHUB_TOKEN!;
  const owner = process.env.GITHUB_OWNER!;
  const repo = process.env.GITHUB_REPO!;
  const branch = process.env.GITHUB_BRANCH ?? 'main';

  const octokit = new Octokit({auth: token});

  let sha: string | undefined = undefined;

  try {
    const existingFile = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: filePath,
      ref: branch,
    });

    if(!Array.isArray(existingFile.data)) {
      sha = existingFile.data.sha;
    }
  } catch(err: unknown) {
    if(err instanceof RequestError) {
      if(err.status !== 404) {
        throw err;
      }
    } else {
      throw err;
    }
  }

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: sha ? `Update post: ${slug}` : `Create post: ${slug}`,
    content: Buffer.from(mdx).toString('base64'),
    branch,
    sha,
  });

  return {slug};
}


function generateDescription(content: string): string {
  let text = content;

  // 이미지 제거 ![...](...)
  text = text.replace(/!\[.*?\]\(.*?\)/g, '');

  // 코드블록 제거 ``` ... ```
  text = text.replace(/```[\s\S]*?```/g, '');

  // 헤더 제거 #, ## 등
  text = text.replace(/^#+\s.+$/gm, '');

  // 인라인 코드 제거
  text = text.replace(/`([^`]*)`/g, '$1');

  // Markdown 링크 제거 [text](url)
  text = text.replace(/\[([^\]]+)]\([^)]+\)/g, '$1');

  // markdown 스타일 제거 (*, >, -, etc)
  text = text.replace(/[*_>~\-]/g, '');

  // 공백 정리
  text = text.replace(/\s+/g, ' ').trim();

  // 너무 길면 자르기 (SEO-friendly)
  if(text.length > 160) {
    return text.substring(0, 157) + '...';
  }

  return text;
}
