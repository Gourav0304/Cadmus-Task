import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './editor.css';

export const Editor: React.FC = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start typing your essay...</p>',
    autofocus: true,
  });

  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
    };

    editor.on('update', update);
    update();
    return () => editor.off('update', update);
  }, [editor]);

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'active' : ''}
        >
          Italic
        </button>
      </div>

      <div className="editor-area">
        <EditorContent editor={editor} />
      </div>

      <div className="word-count">Word count: {wordCount}</div>
    </div>
  );
};
