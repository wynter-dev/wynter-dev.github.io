'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { createPost } from '../../actions/create-post';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// 동적 로딩 (SSR 비활성화)
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {ssr: false});

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('## 본문을 작성하세요');

  // 이미지 업로드 핸들러
  async function handleImageUpload(file: File) {
    const form = new FormData();
    form.append('file', file);

    const res = await fetch('/api/upload', {method: 'POST', body: form});
    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const res = await createPost({
      title,
      content,
      tags: tags.split(',').map((t) => t.trim()),
    });

    setLoading(false);
    router.push(`/blog/${res.slug}`);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <h1 className="text-3xl font-semibold tracking-tight">새 글 작성</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 제목 */}
        <div>
          <label className="block mb-2 text-sm font-medium">제목</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-background"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 본문(MDX) 에디터 */}
        <div data-color-mode="light">
          <label className="block mb-2 text-sm font-medium">내용 (MDX Editor)</label>
          <MDEditor
            height={500}
            value={content}
            onChange={(val) => setContent(val ?? '')}
            preview="edit"
            onDrop={async(e) => {
              const file = e.dataTransfer.files?.[0];
              if(file) {
                const url = await handleImageUpload(file);
                setContent((prev) => prev + `\n\n![](${url})\n`);
              }
            }}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-2 text-sm font-medium">태그 (쉼표 구분)</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-background"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
          글 게시하기
        </button>
      </form>
    </main>
  );
}
