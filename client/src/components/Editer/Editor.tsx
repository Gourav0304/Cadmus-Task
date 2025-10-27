import { EditorContent } from '@tiptap/react';
import { useCollabEditor } from '@/hooks';
import { EditorToolbar } from './EditorToolbar';

export const Editor = () => {
  const { editor, wordCount, setLink, resetDocument } =
    useCollabEditor('main-docs');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl p-4">
        <EditorToolbar editor={editor} onSetLink={setLink} />
        <div
          className="
            border border-gray-200 rounded-lg min-h-52 p-4 focus-within:border-gray-400 focus-within:shadow-sm transition-all"
        >
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
