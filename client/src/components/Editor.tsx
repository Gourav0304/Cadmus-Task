import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
  collab,
  sendableSteps,
  getVersion,
  receiveTransaction,
} from 'prosemirror-collab';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
} from 'lucide-react';

// Debounce util
const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const Editor: React.FC = () => {
  const [wordCount, setWordCount] = useState(0);
  const DOC_ID = 'main-doc';

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    autofocus: 'end',
  });

  // Initialize collab plugin after editor is ready
  useEffect(() => {
    if (!editor) return;

    const initCollab = async () => {
      const res = await fetch(`http://localhost:3001/collab/${DOC_ID}/steps`);
      const data = await res.json();

      // Add ProseMirror collab plugin with current server version
      editor.view.updateState(
        editor.state.reconfigure({
          plugins: [...editor.state.plugins, collab({ version: data.version })],
        })
      );

      // Apply any existing steps
      if (data.steps?.length) {
        const tr = receiveTransaction(editor.state, data.steps, data.clientIDs);
        editor.view.dispatch(tr);
      }
    };

    initCollab();

    // Periodically sync
    const sync = async () => {
      if (!editor) return;

      // Send unconfirmed steps
      const sendable = sendableSteps(editor.state);
      if (sendable) {
        const payload = {
          version: getVersion(editor.state),
          steps: sendable.steps.map((s) => s.toJSON()),
          clientID: sendable.clientID,
        };

        const res = await fetch(
          `http://localhost:3001/collab/${DOC_ID}/steps`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );

        if (res.status === 409) {
          // Conflict — rebase with new steps
          const data = await res.json();
          const tr = receiveTransaction(
            editor.state,
            data.steps,
            data.clientIDs
          );
          editor.view.dispatch(tr);
        }
      }

      // Fetch latest steps from server
      const resFetch = await fetch(
        `http://localhost:3001/collab/${DOC_ID}/steps`
      );
      const dataFetch = await resFetch.json();
      if (dataFetch.steps?.length) {
        const tr = receiveTransaction(
          editor.state,
          dataFetch.steps,
          dataFetch.clientIDs
        );
        editor.view.dispatch(tr);
      }
    };

    const debouncedSync = debounce(sync, 1000);
    const interval = setInterval(debouncedSync, 2000);

    return () => clearInterval(interval);
  }, [editor]);

  // Word count
  useEffect(() => {
    if (!editor) return;

    const updateWordCount = () => {
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    };

    editor.on('update', updateWordCount);
    return () => editor.off('update', updateWordCount);
  }, [editor]);

  // Link handling
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
