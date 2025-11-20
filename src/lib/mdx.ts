import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';

export interface PostMeta {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
}

const POSTS_DIR = path.join(process.cwd(), 'src/content/posts');

/**
 * 파일 목록 가져오기
 */
export function getPostSlugs() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx?$/, ''));
}

/**
 * 개별 글 읽기 (frontmatter + content)
 */
export async function getPostBySlug(slug: string) {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

  if(!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');

  const {content, frontmatter} = await compileMDX<PostMeta>({
    source: fileContent,
    components: {},
    options: {
      parseFrontmatter: true,
    },
  });

  return {
    meta: {
      slug,
      title: frontmatter.title ?? slug,
      description: frontmatter.description ?? '',
      date: frontmatter.date ?? '',
      tags: frontmatter.tags ?? [],
    },
    content,
  };
}

/**
 * 전체 글 목록 가져오기 (정렬 포함)
 */
export async function getAllPosts() {
  const slugs = getPostSlugs();

  const posts = await Promise.all(
    slugs.map(async(slug) => {
      const {meta} = await getPostBySlug(slug);
      return meta;
    }),
  );

  // 최신 날짜 기준 정렬
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}
