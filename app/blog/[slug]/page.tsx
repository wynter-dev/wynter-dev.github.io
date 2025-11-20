import { getPostBySlug, getPostSlugs } from '@/lib/mdx';

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({slug}));
}

export default async function BlogPostPage({params}: {params: {slug: string}}) {
  const resolved = await params;
  const slug = resolved.slug;
  const {meta, content} = await getPostBySlug(slug);

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>{meta.title}</h1>
      <p className="text-sm text-muted-foreground">{meta.date}</p>
      {content}
    </article>
  );
}
