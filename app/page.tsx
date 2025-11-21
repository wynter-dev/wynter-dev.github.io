import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import { getAllPosts } from "@/lib/mdx";

export default async function HomePage() {
  const posts = await getAllPosts();
  const recent = posts.slice(0, 3); // 최신 3개만

  return (
    <main className="flex flex-col items-center px-6 py-16">
      <section className="text-center space-y-6 max-w-2xl">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground bg-muted/40 tracking-tight">
          <PenLine className="h-4 w-4 mr-2" />
          Wynter.log — Dev & Life Notes
        </div>

        <h1 className="text-4xl font-semibold tracking-tight">
          프론트엔드, 인프라, <br />
          그리고 일상의 기록들
        </h1>

        <p className="text-muted-foreground leading-relaxed text-sm">
          개발하면서 배우고 느낀 점들,
          인프라 트러블슈팅,
          투자와 공인중개사 공부까지
          Wynter의 생각들을 담아두는 블로그입니다.
        </p>

        <Link
          href="/blog"
          className="
            inline-flex items-center mt-2
            rounded-md bg-primary px-5 py-2 text-primary-foreground
            hover:bg-primary/90 transition
          "
        >
          블로그 글 보러가기
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>

      {/* Divider */}
      <div className="my-16 h-px w-full max-w-xl bg-border" />

      {/* Recent Posts */}
      <section className="w-full max-w-2xl space-y-6">
        <h2 className="text-xl font-semibold">최근 글</h2>

        <div className="space-y-4">
          {recent.length === 0 && (
            <p className="text-sm text-muted-foreground">
              아직 작성한 글이 없어요. 첫 글을 작성해보세요!
            </p>
          )}

          {recent.map((post) => (
            <Link
              href={`/blog/${post.slug}`}
              key={post.slug}
              className="
                block rounded-lg border p-5
                hover:bg-muted/40 transition
              "
            >
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {post.description}
              </p>
              <span className="text-xs text-muted-foreground">
                {post.date}
              </span>
            </Link>
          ))}
        </div>

        <div className="pt-4">
          <Link
            href="/blog"
            className="text-sm text-primary hover:underline inline-flex items-center"
          >
            전체 글 보기
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
