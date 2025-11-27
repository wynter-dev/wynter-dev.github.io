import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/utils/mdx';

export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

export default async function Image({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;

  const post = await getPostBySlug(slug);
  const {meta} = post;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '60px 80px',
        background: '#0F1117',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: 'Pretendard',
      }}
    >
      <div style={{fontSize: 64, fontWeight: 700}}>{meta.title}</div>
      <div style={{fontSize: 28, marginTop: 20}}>{meta.description}</div>
    </div>,
  );
}
