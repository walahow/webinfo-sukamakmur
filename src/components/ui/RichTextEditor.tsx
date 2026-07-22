'use client';

import React, { useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to prevent SSR issues since it relies on the window object
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-slate-50 dark:bg-slate-900 animate-pulse rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400">Loading Editor...</div>
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const reactQuillRef = useRef<any>(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const quill = reactQuillRef.current.getEditor();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', data.url);
          quill.setSelection(range.index + 1);
        } else {
          console.error('Failed to upload image');
          alert('Gagal mengunggah gambar. Pastikan format didukung dan ukuran di bawah 5MB.');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Terjadi kesalahan saat mengunggah gambar.');
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  return (
    <div className="rich-text-container">
      <ReactQuill 
        // @ts-expect-error - next/dynamic ref type mismatch
        ref={reactQuillRef}
        theme="snow" 
        value={value} 
        onChange={onChange}
        modules={modules}
        className="bg-white dark:bg-slate-900 rounded-b-xl overflow-hidden"
      />
      <style dangerouslySetInnerHTML={{__html: `
        .ql-toolbar {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          border-color: #e2e8f0 !important;
          background-color: #f8fafc;
        }
        .dark .ql-toolbar {
          border-color: #1e293b !important;
          background-color: #0f172a;
        }
        .ql-container {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          border-color: #e2e8f0 !important;
          min-height: 300px;
          font-family: inherit !important;
          font-size: 1rem !important;
        }
        .dark .ql-container {
          border-color: #1e293b !important;
          background-color: #0f172a;
          color: #f1f5f9;
        }
        .dark .ql-stroke { stroke: #94a3b8 !important; }
        .dark .ql-fill { fill: #94a3b8 !important; }
        .dark .ql-picker { color: #94a3b8 !important; }
      `}} />
    </div>
  );
}
