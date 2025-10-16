import React, { useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
} from 'lucide-react';

export const Editor: React.FC = () => {
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: '<p>Start typing your essay...</p>',
    autofocus: 'end',
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
    },
  });

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl || '');

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl p-4">
        <div className="flex flex-wrap items-center gap-2 border-b pb-2 mb-4">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor?.isActive('bold') ? 'bg-gray-200' : ''
            }`}
            title="Bold"
          >
            <Bold size={16} />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor?.isActive('italic') ? 'bg-gray-200' : ''
            }`}
            title="Italic"
          >
            <Italic size={16} />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor?.isActive('bulletList') ? 'bg-gray-200' : ''
            }`}
            title="Bullet List"
          >
            <List size={16} />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor?.isActive('orderedList') ? 'bg-gray-200' : ''
            }`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>

          <button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor?.isActive('blockquote') ? 'bg-gray-200' : ''
            }`}
            title="Quote"
          >
            <Quote size={16} />
          </button>

          <button
            onClick={setLink}
            className="p-2 rounded hover:bg-gray-100"
            title="Add/Edit Link"
          >
            <LinkIcon size={16} />
          </button>

          <button
            onClick={() => editor?.chain().focus().unsetLink().run()}
            className="p-2 rounded hover:bg-gray-100"
            title="Remove Link"
          >
            <Unlink size={16} />
          </button>
        </div>

        <div className="prose max-w-none border rounded-lg p-4 min-h-[300px] focus:outline-none">
          <EditorContent editor={editor} />
        </div>

        <div className="text-sm text-gray-600 text-right mt-2">
          Word count: <span className="font-semibold">{wordCount}</span>
        </div>
      </div>
    </div>
  );
};
