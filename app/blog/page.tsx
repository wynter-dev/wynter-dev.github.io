import {getAllPosts} from '@/utils/mdx';
import AdBanner from '@/components/ad/AdBanner';
import PostCard from '@/components/blog/PostCard';

export const metadata = {
  title: 'Blog | Wynter.log',
  description: '개발, 인프라, 일상 기록 블로그',
};

export default async function BlogListPage() {
  const posts = await getAllPosts();

  return (
    <main className="flex flex-col">
      <section className="flex items-start justify-between mb-5">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">블로그</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            개발하면서 배운 것들, 인프라 트러블슈팅 기록,
            일상의 생각들을 담고 있는 공간입니다.
          </p>
        </div>
      </section>
      <section className="space-y-6">
        {posts.length === 0 && (
          <p className="text-muted-foreground text-sm">작성된 글이 없습니다.</p>
        )}

        {posts.map((post) => (
          <PostCard
            key={post.slug}
            {...post}
          />
        ))}
      </section>
      <AdBanner adSlot="1234567890" className="mt-10" />
    </main>
  );
}
