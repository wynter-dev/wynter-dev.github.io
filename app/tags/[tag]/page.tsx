import { getAllPosts } from "@/utils/mdx";
import Link from "next/link";
import PostCard from '@/components/blog/PostCard';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const tagSet = new Set(posts.flatMap((p) => p.tags ?? []));
  return [...tagSet].map((tag) => ({ tag }));
}

export default async function TagDetailPage({ params }: { params: { tag: string } }) {
  const resolved = await params;
  const tag = decodeURIComponent(resolved.tag);
  const posts = await getAllPosts();
  const filtered = posts.filter((p) => p.tags?.includes(tag));

  return (
    <main className="flex flex-col">
      <h1 className="text-3xl font-bold tracking-tight">#{tag}</h1>
      <section className="space-y-4 py-5">
        {filtered.map((post) => (
          <PostCard key={post.slug} {...post} />
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground">해당 태그의 글이 없습니다.</p>
        )}
      </section>
    </main>
  );
}
