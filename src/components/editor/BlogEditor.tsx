'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Image as ImageIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {ssr: false});

interface BlogEditorProps {
  value: string;
  onChange: (v: string) => void;
}

export default function BlogEditor({value, onChange}: BlogEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const {resolvedTheme} = useTheme();
  const [imageOption, setImageOption] = useState('original');

  useEffect(() => setMounted(true), []);

  // ------------------------------------------------
  // LIGHTBOX
  // ------------------------------------------------
  useEffect(() => {
    const showLightbox = (src: string) => {
      const root = document.getElementById('lightbox-root');
      if(!root) return;

      root.innerHTML = `
        <div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center cursor-zoom-out" id="lightbox-overlay">
          <img src="${src}" class="max-w-[95%] max-h-[95%] rounded-lg shadow-xl" />
        </div>
      `;

      const overlay = document.getElementById('lightbox-overlay');
      if(overlay) overlay.onclick = () => (root.innerHTML = '');
    };

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // 확대 zoom
      if(target.tagName === 'IMG' && target.dataset.zoom === 'true') {
        const src = target.getAttribute('src');
        if(src) showLightbox(src);
      }
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // ------------------------------------------------
  // CURSOR INSERT
  // ------------------------------------------------
  function insertAtCursor(text: string) {
    const textarea = editorRef.current?.querySelector('textarea') as HTMLTextAreaElement | null;

    if(!textarea) {
      onChange(value + text);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    onChange(value.slice(0, start) + text + value.slice(end));

    setTimeout(() => {
      const pos = start + text.length;
      textarea.selectionStart = pos;
      textarea.selectionEnd = pos;
      textarea.focus();
    }, 0);
  }

  // ------------------------------------------------
  // IMAGE INSERT
  // ------------------------------------------------
  function insertImage(url: string) {
    let sizeClass = '';

    if(imageOption === '500') sizeClass = 'w-[500px]';
    else if(imageOption === '700') sizeClass = 'w-[700px]';
    else if(imageOption === 'square') sizeClass = 'w-[600px] aspect-square object-cover';

    const imgHtml = `<img src="${url}" data-zoom="true" class="mx-auto rounded-lg cursor-zoom-in max-w-full ${sizeClass}" />`;

    // placeholder 주석이 있다면 치환
    if(value.includes('<!-- image-placeholder -->')) {
      const updated = value.replace('<!-- image-placeholder -->', imgHtml);
      onChange(updated);
      return;
    }

    insertAtCursor(`\n${imgHtml}\n`);
  }

  // ------------------------------------------------
  // UPLOAD
  // ------------------------------------------------
  async function handleImageUpload(file: File) {
    const form = new FormData();
    form.append('file', file);
    form.append('option', imageOption);

    const res = await fetch('/api/blog/image/upload', {method: 'POST', body: form});
    const data: {url: string} = await res.json();
    return data.url;
  }

  async function handleSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if(!file) return;

    const url = await handleImageUpload(file);
    insertImage(url);

    e.target.value = '';
  }

  function triggerFileSelect() {
    fileInputRef.current?.click();
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm font-medium">이미지 옵션</label>
        <select
          value={imageOption}
          onChange={(e) => setImageOption(e.target.value)}
          className="border rounded px-2 py-1 bg-background"
        >
          <option value="original">원본</option>
          <option value="500">폭 500</option>
          <option value="700">폭 700</option>
          <option value="square">정사각형</option>
        </select>
      </div>

      <div
        ref={editorRef}
        data-color-mode={mounted ? resolvedTheme : undefined}
        className={cn('pr-1')}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleSelectFile}
        />

        <MDEditor
          value={value}
          onChange={(v) => onChange(v ?? '')}
          height={700}
          preview="live"
          previewOptions={{
            skipHtml: false,
          }}
          onDrop={async(e) => {
            const file = e.dataTransfer.files?.[0];
            if(file) {
              const url = await handleImageUpload(file);
              insertImage(url);
            }
          }}
          extraCommands={[
            {
              name: 'upload-image',
              keyCommand: 'upload-image',
              buttonProps: {title: '이미지 업로드'},
              icon: <ImageIcon size={18}/>,
              execute: () => triggerFileSelect(),
            },
          ]}
        />
      </div>
    </div>
  );
}
