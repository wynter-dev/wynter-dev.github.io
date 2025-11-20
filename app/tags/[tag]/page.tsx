import { getAllPosts } from "@/lib/mdx";
import Link from "next/link";

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
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      <h1 className="text-3xl font-bold tracking-tight">#{tag}</h1>

      <section className="space-y-4">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block border rounded-xl p-5 hover:bg-muted/50 transition"
          >
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {post.description}
            </p>
          </Link>
        ))}

        {filtered.length === 0 && (
          <p className="text-muted-foreground">해당 태그의 글이 없습니다.</p>
        )}
      </section>
    </main>
  );
}
