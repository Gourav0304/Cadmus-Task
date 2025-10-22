import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { collab, sendableSteps, receiveTransaction } from 'prosemirror-collab';
import { EditorState } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
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
import { debounce } from '../hooks/useDebounce';
import { getSteps, postSteps, resetDoc } from '../services/CollabApi';

export const Editor: React.FC = () => {
  const [wordCount, setWordCount] = useState(0);
  const DOC_ID = 'main-docs';

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
    content: '',
  });

  useEffect(() => {
    if (!editor) return;

    let currentVersion = 0;

    const initCollab = async () => {
      try {
        const data = await getSteps(DOC_ID, 0);
        currentVersion = data.version || 0;

        const collabPlugin = collab({ version: currentVersion });
        let newState = EditorState.create({
          doc: editor.state.doc.type.createAndFill(),
          plugins: [...editor.state.plugins, collabPlugin],
        });

        if (data.steps?.length) {
          const steps = data.steps.map((s: any) =>
            Step.fromJSON(editor.schema, s)
          );
          const tr = receiveTransaction(newState, steps, data.clientIDs);
          newState = newState.apply(tr);
        }

        editor.view.updateState(newState);
      } catch (err) {
        console.error('Error initializing collab:', err);
      }
    };

    const sync = async () => {
      if (!editor) return;

      try {
        const dataFetch = await getSteps(DOC_ID, currentVersion);

        if (dataFetch.version > currentVersion) {
          const steps = dataFetch.steps.map((s: any) =>
            Step.fromJSON(editor.schema, s)
          );
          const tr = receiveTransaction(
            editor.state,
            steps,
            dataFetch.clientIDs
          );
          editor.view.dispatch(tr);
          currentVersion = dataFetch.version;
        }

        const sendable = sendableSteps(editor.state);
        if (!sendable) return;

        const payload = {
          version: sendable.version,
          steps: sendable.steps.map((s) => s.toJSON()),
          clientID: sendable.clientID,
        };

        try {
          await postSteps(DOC_ID, payload);
        } catch (error: any) {
          if (error.message.includes('409')) {
            const data = await getSteps(DOC_ID, currentVersion);
            const serverSteps = data.steps.map((s: any) =>
              Step.fromJSON(editor.schema, s)
            );
            const tr = receiveTransaction(
              editor.state,
              serverSteps,
              data.clientIDs
            );
            editor.view.dispatch(tr);
            currentVersion = data.version;
          } else {
            console.error('Sync error:', error);
          }
        }
      } catch (err) {
        console.error('Error syncing:', err);
      }
    };

    initCollab();

    const debouncedSync = debounce(sync, 500);
    const interval = setInterval(debouncedSync, 2000);

    editor.on('update', debouncedSync);

    return () => {
      clearInterval(interval);
      editor.off('update', debouncedSync);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const updateWordCount = () => {
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    };

    editor.on('update', updateWordCount);
    return () => editor.off('update', updateWordCount);
  }, [editor]);

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
            className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('bold') ? 'bg-gray-200' : ''}`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('italic') ? 'bg-gray-200' : ''}`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('bulletList') ? 'bg-gray-200' : ''}`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('orderedList') ? 'bg-gray-200' : ''}`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('blockquote') ? 'bg-gray-200' : ''}`}
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

        <button
          onClick={() => resetDoc(DOC_ID)}
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
