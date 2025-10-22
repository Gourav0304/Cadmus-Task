import React from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
} from 'lucide-react';
import { Editor } from '@tiptap/react';

type ToolbarProps = {
  editor: Editor | null;
  onSetLink: () => void;
};

export const EditorToolbar: React.FC<ToolbarProps> = ({
  editor,
  onSetLink,
}) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b pb-2 mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
        className={
          editor.isActive('bold') ? 'bg-gray-200 p-2 rounded' : 'p-2 rounded'
        }
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
        className={
          editor.isActive('italic') ? 'bg-gray-200 p-2 rounded' : 'p-2 rounded'
        }
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
        className={
          editor.isActive('bulletList')
            ? 'bg-gray-200 p-2 rounded'
            : 'p-2 rounded'
        }
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered List"
        className={
          editor.isActive('orderedList')
            ? 'bg-gray-200 p-2 rounded'
            : 'p-2 rounded'
        }
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Quote"
        className={
          editor.isActive('blockquote')
            ? 'bg-gray-200 p-2 rounded'
            : 'p-2 rounded'
        }
      >
        <Quote size={16} />
      </button>
      <button onClick={onSetLink} title="Add/Edit Link" className="p-2 rounded">
        <LinkIcon size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().unsetLink().run()}
        title="Remove Link"
        className="p-2 rounded"
      >
        <Unlink size={16} />
      </button>
    </div>
  );
};
