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
import './editor.css';

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

    // If user cancels, do nothing
    if (url === null) return;

    // If URL is empty, remove the link
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    // Otherwise, set the new link
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="editor-wrapper">
      <div className="editor-toolbar">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'active' : ''}
          title="Bold"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'active' : ''}
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'active' : ''}
          title="Bullet List"
        >
          <List size={16} />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive('orderedList') ? 'active' : ''}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={editor?.isActive('blockquote') ? 'active' : ''}
          title="Quote"
        >
          <Quote size={16} />
        </button>

        <button onClick={setLink} title="Add/Edit Link">
          <LinkIcon size={16} />
        </button>

        <button
          onClick={() => editor?.chain().focus().unsetLink().run()}
          title="Remove Link"
        >
          <Unlink size={16} />
        </button>
      </div>

      <div className="editor-box">
        <EditorContent editor={editor} />
      </div>

      <div className="word-count">Word count: {wordCount}</div>
    </div>
  );
};
