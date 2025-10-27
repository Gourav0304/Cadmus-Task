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
import { cn } from '@/utils/cn';

type ToolbarProps = {
  editor: Editor | null;
  onSetLink: () => void;
};

export const EditorToolbar = ({ editor, onSetLink }: ToolbarProps) => {
  if (!editor) return null;
  const buttonBase =
    'p-2 rounded-md transition-all duration-150 hover:bg-gray-300 active:scale-95';
  const activeBtn = 'bg-blue-100 text-blue-600';

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 hover:border-gray-400 pb-2 mb-4 bg-white/60 backdrop-blur-sm rounded-t-lg shadow-sm px-2">
      <div className="flex items-center gap-1 pr-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
          className={cn(buttonBase, editor.isActive('bold') && activeBtn)}
        >
          <Bold size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
          className={cn(buttonBase, editor.isActive('italic') && activeBtn)}
        >
          <Italic size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 pr-1">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
          className={cn(buttonBase, editor.isActive('bulletList') && activeBtn)}
        >
          <List size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
          className={cn(
            buttonBase,
            editor.isActive('orderedList') && activeBtn
          )}
        >
          <ListOrdered size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 pr-1">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
          className={cn(buttonBase, editor.isActive('blockquote') && activeBtn)}
        >
          <Quote size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onSetLink}
          title="Add/Edit Link"
          className={cn(buttonBase)}
        >
          <LinkIcon size={16} />
        </button>

        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          title="Remove Link"
          className={cn(buttonBase)}
        >
          <Unlink size={16} />
        </button>
      </div>
    </div>
  );
};
