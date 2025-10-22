import { EditorContent } from '@tiptap/react';
import { useCollabEditor } from '../hooks/useCollabEditor';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
} from 'lucide-react';

export const EditorComponent: React.FC = () => {
  const { editor, wordCount, setLink, resetDocument } =
    useCollabEditor('main-docs');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl p-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b pb-2 mb-4">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
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

        <div className="prose max-w-none border rounded-lg p-4 min-h-[300px] focus:outline-none">
          <EditorContent editor={editor} />
        </div>

        <button
          onClick={resetDocument}
          className="text-xs text-red-500 underline mt-2"
        >
          Reset Document
        </button>

        <div className="text-sm text-gray-600 text-right mt-2">
          Word count: <span className="font-semibold">{wordCount}</span>
        </div>
      </div>
    </div>
  );
};
