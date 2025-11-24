import {notFound} from 'next/navigation';
import AdBanner from '@/components/ad/AdBanner';
import {getPostsByCategory} from '@/utils/mdx';
import {CATEGORIES, findCategoryByPath} from '@/utils/category';
import PostCard from '@/components/blog/PostCard';

export default async function CategoryPage({params}: { params: { category: string[] } }) {
  const resolved = await params;
  const categoryPath = resolved.category;

  const category = findCategoryByPath(CATEGORIES, categoryPath);
  if (!category) return notFound();

  const posts = await getPostsByCategory(category.fullPath);

  return (
    <main className="flex flex-col">
      <section className="flex items-start justify-between mb-5">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">{category.label}</h1>
          <p className="text-muted-foreground text-sm">
            {category.fullPath.join(' / ')}
          </p>
        </div>
      </section>

      <section className="space-y-6">
        {posts.length === 0 && (
          <p className="text-muted-foreground text-sm">
            아직 이 카테고리에는 글이 없습니다.
          </p>
        )}

        {posts.map((post) => (
          <PostCard key={post.slug} {...post} />
        ))}
      </section>

      <AdBanner adSlot="1234567890" className="mt-10" />
    </main>
  );
}
