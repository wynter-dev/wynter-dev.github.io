import { getAllTags } from "@/lib/mdx";
import Link from "next/link";

export const metadata = {
  title: "Tags | Wynter.log",
};

export default async function TagsPage() {
  const tags = await getAllTags();
  console.log(tags);

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      <h1 className="text-3xl font-bold tracking-tight">Tags</h1>

      <section className="flex flex-wrap gap-3 pt-4">
        {tags.map(({ tag, count }) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="px-3 py-1 rounded-full text-sm border bg-muted hover:bg-muted/70 transition"
          >
            #{tag} <span className="text-muted-foreground">({count})</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
