import fs from "fs";
import path from "path";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import AdBanner from "@/components/ad/AdBanner";

export interface PostMeta {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];

  depth1?: string | null;
  depth2?: string | null;
  depth3?: string | null;
}

export const POSTS_ROOT = path.join(process.cwd(), "src/content/posts");


/* ---------------------------------------------
 *  1) 지원할 모든 Markdown 확장자
 * ------------------------------------------- */
export const MARKDOWN_EXTENSIONS = [
  ".md",
  ".mdx",
  ".markdown",
  ".mdown",
  ".mkd",
  ".mkdn"
] as const;

/* ---------------------------------------------
 *  2) 파일 확장자가 markdown인지 체크
 * ------------------------------------------- */
export function isMarkdownFile(filename: string): boolean {
  return MARKDOWN_EXTENSIONS.some((ext) => filename.endsWith(ext));
}

/* ---------------------------------------------
 *  3) 확장자 제거 (모든 markdown 변종 지원)
 * ------------------------------------------- */
export function stripMarkdownExtension(filename: string): string {
  let name = filename;
  for (const ext of MARKDOWN_EXTENSIONS) {
    if (name.endsWith(ext)) {
      name = name.slice(0, -ext.length);
      break;
    }
  }
  return name;
}


/* ---------------------------------------------
 *  4) 재귀적으로 MDX/MD 파일 전부 찾기
 * ------------------------------------------- */
export function getAllMarkdownFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const files = fs.readdirSync(dir);

  for (const f of files) {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllMarkdownFilesRecursively(fullPath));
    } else if (isMarkdownFile(f)) {
      results.push(fullPath);
    }
  }

  return results;
}


/* ---------------------------------------------
 *  5) depth 추출
 * ------------------------------------------- */
export function extractDepthFromPath(filePath: string) {
  const relative = path.relative(POSTS_ROOT, filePath);
  const parts = relative.split(path.sep);

  const part1 = parts[0] ?? null;
  const part2 = parts[1] && !isMarkdownFile(parts[1]) ? parts[1] : null;
  const part3 = parts[2] && !isMarkdownFile(parts[2]) ? parts[2] : null;

  return {
    depth1: part1,
    depth2: part2,
    depth3: part3,
  };
}


/* ---------------------------------------------
 *  6) 개별 MDX 파일 로드
 * ------------------------------------------- */
export async function loadMarkdownFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const filename = path.basename(filePath);

  const slug = stripMarkdownExtension(filename);
  const depthInfo = extractDepthFromPath(filePath);

  const { content, frontmatter } = await compileMDX<PostMeta>({
    source: fileContent,
    components: mdxComponents,
    options: { parseFrontmatter: true }
  });

  return {
    meta: {
      slug,
      title: frontmatter.title ?? slug,
      description: frontmatter.description ?? "",
      date: frontmatter.date ?? "",
      tags: frontmatter.tags ?? [],
      depth1: frontmatter.depth1 ?? depthInfo.depth1,
      depth2: frontmatter.depth2 ?? depthInfo.depth2,
      depth3: frontmatter.depth3 ?? depthInfo.depth3,
    },
    content,
  };
}


/* ---------------------------------------------
 *  7) 전체 로드
 * ------------------------------------------- */
export async function getAllPostsFull() {
  const files = getAllMarkdownFilesRecursively(POSTS_ROOT);
  if (files.length === 0) return [];

  const posts = await Promise.all(files.map(loadMarkdownFile));
  return posts.map((p) => p.meta);
}


/* ---------------------------------------------
 *  8) 최근 N개
 * ------------------------------------------- */
export async function getAllPosts(limit = 30) {
  const all = await getAllPostsFull();
  const sorted = all.sort((a, b) => (a.date > b.date ? -1 : 1));
  return sorted.slice(0, limit);
}


/* ---------------------------------------------
 *  9) slug로 단일 포스트로드
 * ------------------------------------------- */
export async function getPostBySlug(slug: string) {
  const files = getAllMarkdownFilesRecursively(POSTS_ROOT);

  const filePath = files.find((f) =>
    MARKDOWN_EXTENSIONS.some((ext) => f.endsWith(`${decodeURIComponent(slug)}${ext}`))
  );

  if (!filePath) notFound();
  return loadMarkdownFile(filePath);
}


/* ---------------------------------------------
 * 10) 카테고리별 필터링
 * ------------------------------------------- */
export async function getPostsByCategory(fullPath: string[]) {
  const all = await getAllPostsFull();

  return all.filter((post) => {
    const arr = [post.depth1, post.depth2, post.depth3].filter(Boolean);
    return fullPath.every((v, i) => arr[i] === v);
  });
}


/* ---------------------------------------------
 * 11) 최근 30개 태그 정리
 * ------------------------------------------- */
export async function getAllTags() {
  const posts = await getAllPosts();
  const tagMap: Record<string, number> = {};

  posts.forEach((post) => {
    (post.tags ?? []).forEach((tag) => {
      const clean = tag.trim();
      if (clean.length > 0) {
        tagMap[clean] = (tagMap[clean] || 0) + 1;
      }
    });
  });

  return Object.entries(tagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}


/* ---------------------------------------------
 * 12) 단일 메타만 가져오기
 * ------------------------------------------- */
export async function getPostMetaBySlug(slug: string) {
  const all = await getAllPostsFull();
  return all.find((p) => p.slug === slug) ?? null;
}


const mdxComponents = { AdBanner };
