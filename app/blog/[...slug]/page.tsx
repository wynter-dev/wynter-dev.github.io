import {notFound} from 'next/navigation';
import Link from 'next/link';
import {Calendar, Tag} from 'lucide-react';

import '@/styles/markdown.css';
import AdBanner from '@/components/ad/AdBanner';

import {getPostBySlug} from '@/utils/mdx';

export default async function BlogPostPage({params}: { params: { slug: string[] } }) {
  const resolved = await params;
  const slugArray = resolved.slug;
  const slug = slugArray.at(-1);

  if (!slug) return notFound();

  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const { meta, content } = post;

  // breadcrumb는 depth 경로로 만들기
  const fullPath = [meta.depth1, meta.depth2, meta.depth3].filter(Boolean);
  const hasCategory = fullPath.length > 0;

  return (
    <main className="flex flex-col">
      <section className="flex items-start justify-between mb-5">
        <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {meta.date}
          </span>

          {meta.tags?.length > 0 && (
            <span className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {meta.tags.join(", ")}
            </span>
          )}
        </div>

        {/* 카테고리 Breadcrumb */}
        {hasCategory && (
          <div className="text-xs text-muted-foreground">
            {fullPath.map((p, i) => (
              <span key={p}>
                <Link
                  className="hover:underline underline-offset-4"
                  href={`/blog/${fullPath.slice(0, i + 1).join("/")}`}
                >
                  {p}
                </Link>
                {i < fullPath.length - 1 && " / "}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* CONTENT */}
      <article className="markdown-body">{content}</article>

      {/* NAVIGATION */}
      <section className="pt-10 border-t flex justify-between text-sm">
        <Link href="/blog" className="text-primary hover:underline underline-offset-4">
          ← 블로그 목록
        </Link>
      </section>

      <AdBanner adSlot="2345678901" className="mt-10" />
    </main>
  );
}