'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import CategorySelect from '@/components/admin/post/new/CategorySelect';
import { Button } from '@/components/ui/button';
import BlogEditor from '@/components/editor/BlogEditor';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [categoryPath, setCategoryPath] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const [depth1, depth2, depth3] = categoryPath;
    if (!depth1) {
      alert('카테고리 depth1는 반드시 선택해야 합니다.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          tags: tags.split(',').map(t => t.trim()),
          depth1,
          depth2,
          depth3: depth3 || null,
        }),
      });

      if (!res.ok) {
        alert('작성 중 오류가 발생했습니다.');
        return;
      }

      router.push('/admin/posts');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col">
      <div id="lightbox-root"></div>

      <h1 className="text-2xl md:text-4xl font-semibold tracking-tight mb-10">새 글 작성</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block mb-2 text-lg font-medium">제목</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-background"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <CategorySelect value={categoryPath} onChange={setCategoryPath} />

        <BlogEditor value={content} onChange={setContent} />

        <div>
          <label className="block mb-2 text-lg font-medium">태그</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-background"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
        </div>

        <Button
          disabled={loading}
          className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80"
        >
          {loading && <span className="animate-spin mr-2">⏳</span>}
          글 게시하기
        </Button>
      </form>
    </div>
  );
}
