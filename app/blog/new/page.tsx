'use client';

import {FormEvent, useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {createPost} from '@app/actions/create-post';
import {useRouter} from 'next/navigation';
import {Loader2} from 'lucide-react';
import CategorySelect from '@/components/blog/new/CategorySelect';
import {Button} from '@/components/ui/button';
import {useTheme} from 'next-themes';
import {cn} from '@/lib/utils';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {ssr: false});

export default function NewBlogPostPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const {resolvedTheme} = useTheme();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');

  const [categoryPath, setCategoryPath] = useState<string[]>([]);

  useEffect(() => setMounted(true), []);

  async function handleImageUpload(file: File) {
    const form = new FormData();
    form.append('file', file);

    const res = await fetch('/api/upload', {method: 'POST', body: form});
    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const [depth1, depth2, depth3] = categoryPath;
    if (!depth1) {
      alert('카테고리 depth1는 반드시 선택해야 합니다.');
      return;
    }

    setLoading(true);

    const res = await createPost({
      title,
      content,
      tags: tags.split(',').map((t) => t.trim()),
      depth1,
      depth2,
      depth3: depth3 || null,
    });

    setLoading(false);

    const fullPath = [depth1, depth2, depth3].filter(Boolean);
    const categoryUrl = `/blog/category/${fullPath.join('/')}`;

    router.push(`${categoryUrl}/${res.slug}`);
  }

  return (
    <main className="flex flex-col">
      <h1 className="text-3xl font-semibold tracking-tight">새 글 작성</h1>

      <form onSubmit={handleSubmit} className="space-y-8 py-10">
        <div>
          <h1 className="block mb-2 text-lg font-medium">제목</h1>
          <input
            className="w-full border rounded-md px-3 py-2 bg-background"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <CategorySelect
          value={categoryPath}
          onChange={setCategoryPath}
        />
        <div data-color-mode={mounted ? resolvedTheme : undefined} className={cn(`pr-1`)}>
          <label className="block mb-2 text-lg font-medium">내용</label>
          <MDEditor
            height={500}
            value={content}
            onChange={(val) => setContent(val ?? '')}
            preview="edit"
            onDrop={async (e) => {
              const file = e.dataTransfer.files?.[0];
              if (file) {
                const url = await handleImageUpload(file);
                setContent((prev) => prev + `\n\n![](${url})\n`);
              }
            }}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-2 text-lg font-medium">태그</label>
          <input
            className="w-full border rounded-md px-3 py-2 bg-background"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={loading}
          className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          글 게시하기
        </Button>
      </form>
    </main>
  );
}
