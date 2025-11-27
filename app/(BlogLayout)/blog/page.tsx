import { getAllPostsPaginated } from '@/utils/mdx';
import PostCard from '@/components/blog/PostCard';
import PageSizeSelect from '@/components/pagination/PageSizeSelect';

interface BlogListPageProps {
  searchParams: {
    pageSize?: string;
  };
}

export default async function BlogListPage({searchParams}: BlogListPageProps) {
  const {pageSize} = await searchParams;
  const pageRange = Number(pageSize ?? 10);
  const {posts} = await getAllPostsPaginated(1, pageRange);

  return (
    <div className="flex flex-col">
      <section className="flex items-start justify-between mb-5">
        <div className="space-y-3">
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight">블로그</h1>
        </div>
        <PageSizeSelect pageSize={pageRange}/>
      </section>
      <section className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.slug} {...post} />
        ))}
      </section>
    </div>
  );
}
