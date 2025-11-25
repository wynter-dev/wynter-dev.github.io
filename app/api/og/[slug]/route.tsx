import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/utils/mdx';

export const runtime = 'edge';

export async function GET(req: Request, context: {params: {slug: string}}) {
  const slug = context.params.slug;
  const post = await getPostBySlug(slug);

  if(!post) {
    return new Response('Not found', {status: 404});
  }

  const {meta} = post;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: 'white',
          padding: '64px',
          flexDirection: 'column',
          justifyContent: 'center',
          fontSize: 48,
          fontWeight: 700,
        }}
      >
        <div style={{fontSize: 56, marginBottom: 24}}>{meta.title}</div>
        <div style={{fontSize: 24, opacity: 0.6}}>{meta.description ?? ''}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
