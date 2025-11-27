import type { MetadataRoute } from 'next';
import { getAllPostsPaginated } from '@/utils/mdx';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wynter-dev.vercel.app';

  const staticPaths = ['', '/blog', '/about', '/tags', '/blog/category'];

  const staticUrls: MetadataRoute.Sitemap = staticPaths.map(path => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const { posts } = await getAllPostsPaginated(1, 999999);

  const categorySet = new Set<string>();
  posts.forEach(post => {
    if (post.depth1?.trim()) categorySet.add(post.depth1.trim());
  });

  const categoryUrls: MetadataRoute.Sitemap = Array.from(categorySet).map(category => ({
    url: `${siteUrl}/blog/category/${category}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const postUrls: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedDate || post.createdDate).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticUrls, ...categoryUrls, ...postUrls];
}
