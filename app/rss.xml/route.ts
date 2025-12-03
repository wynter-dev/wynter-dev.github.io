import { getAllPostsPaginated } from '@/utils/mdx';

export const dynamic = 'force-static';

export async function GET() {
  const { posts } = await getAllPostsPaginated(1, 999999);

  // 사이트 기본 URL
  const siteUrl = 'https://wynter-blog.vercel.app';

  // 최신순 정렬
  const sorted = posts.sort((a, b) => {
    return (
      new Date(b.updatedDate || b.createdDate).getTime() -
      new Date(a.updatedDate || a.createdDate).getTime()
    );
  });

  // 업데이트 날짜 (RSS에 가장 중요)
  const updated =
    sorted[0]?.updatedDate || sorted[0]?.createdDate || new Date().toISOString();

  // RSS items
  const items = sorted
    .map(
      (post) => `
  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${siteUrl}/blog/${post.slug}</link>
    <guid>${siteUrl}/blog/${post.slug}</guid>
    <pubDate>${new Date(post.createdDate).toUTCString()}</pubDate>
    <description><![CDATA[${post.description || ''}]]></description>
  </item>
  `
    )
    .join('');

  // RSS XML
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Wynter.log RSS</title>
  <link>${siteUrl}</link>
  <description>Wynter Blog Feed</description>
  <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
