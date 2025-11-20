'use server';

import { Octokit } from 'octokit';

export async function createPost({
                                   title,
                                   description,
                                   content,
                                   tags = [],
                                 }: {
  title: string;
  description: string;
  content: string;
  tags: string[];
}) {
  const token = process.env.GITHUB_TOKEN;
  if(!token) throw new Error('Missing GITHUB_TOKEN env variable');

  const octokit = new Octokit({auth: token});

  const owner = process.env.GITHUB_OWNER!;
  const repo = process.env.GITHUB_REPO!;
  const branch = process.env.GITHUB_BRANCH ?? 'main';

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ㄱ-ㅎ가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const mdx = `---
title: "${title}"
description: |
  ${description.replace(/\n/g, "\n  ")}
date: "${new Date().toISOString().split("T")[0]}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
---

${content}
`;

  const filePath = `src/content/posts/${slug}.mdx`;

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `Create post: ${slug}`,
    content: Buffer.from(mdx, 'utf8').toString('base64'),
    branch,
  });

  return {slug};
}
