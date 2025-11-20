import Link from 'next/link';
import { Github, Mail, PencilLine } from 'lucide-react';

export const metadata = {
  title: 'About | Wynter.log',
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-12">
      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">About Me</h1>
        <p className="text-muted-foreground text-lg">
          프론트엔드 개발자로서 경험, 철학, 그리고 앞으로 만들고 싶은 것들에 대한 소개.
        </p>
      </section>

      {/* Profile Info */}
      <section className="rounded-xl border p-6 bg-card/40 backdrop-blur-sm space-y-4">
        <h2 className="text-xl font-semibold">👋 안녕하세요, Wynter 입니다.</h2>
        <p className="leading-relaxed text-muted-foreground">
          React · Next.js · TypeScript를 주력으로 사용하는 프론트엔드 개발자입니다.
          <br/> 사용자 경험을 높이는 인터페이스, 직관적인 시스템 구조, 그리고
          <strong className="text-foreground"> 유지보수가 쉬운 코드</strong>를 만드는 데
          가장 큰 재미를 느낍니다.
        </p>

        <p className="leading-relaxed text-muted-foreground">
          현재는 결제 서비스 중심의 플랫폼을 개발하며,
          <br/> 프론트엔드 아키텍처 개선 · 레거시 React/Vue 마이그레이션 · CI/CD 자동화 ·
          인프라 최적화까지 폭넓게 다루고 있습니다.
        </p>
      </section>

      {/* Skills */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">🛠 Skills</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border p-5 bg-muted/20">
            <h3 className="font-medium mb-3">Frontend</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>React / Next.js / React Query / Zustand</li>
              <li>TypeScript · TanStack Query · SWR</li>
              <li>Tailwind · shadcn · Emotion · Styled Components</li>
            </ul>
          </div>

          <div className="rounded-xl border p-5 bg-muted/20">
            <h3 className="font-medium mb-3">Infra / DevOps</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>AWS (S3, CloudFront, EC2, WAF, VPC, IAM)</li>
              <li>GitLab CI/CD · Github Actions</li>
              <li>Docker · Nginx · Cloudflare</li>
            </ul>
          </div>

          <div className="rounded-xl border p-5 bg-muted/20">
            <h3 className="font-medium mb-3">Backend / Other</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Node.js · Express</li>
              <li>Database 설계 · Redis 캐시 적용</li>
              <li>Observability / Sentry / Logging</li>
            </ul>
          </div>

          <div className="rounded-xl border p-5 bg-muted/20">
            <h3 className="font-medium mb-3">Interests</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>프론트엔드 아키텍처 및 성능 최적화</li>
              <li>디자인 시스템 · UI/UX</li>
              <li>투자 · 기술 트렌드 읽기 · 생산성 도구</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">📬 Contact & Links</h2>

        <div className="flex flex-wrap gap-4">
          <a
            href="https://github.com/yourname"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted transition"
          >
            <Github className="h-4 w-4"/> GitHub
          </a>

          <a
            href="mailto:you@email.com"
            className="flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted transition"
          >
            <Mail className="h-4 w-4"/> Email
          </a>

          <Link
            href="/blog"
            className="flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted transition"
          >
            <PencilLine className="h-4 w-4"/> Blog
          </Link>
        </div>
      </section>
    </main>
  );
}
