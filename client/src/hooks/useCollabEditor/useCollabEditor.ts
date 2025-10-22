import { useEffect, useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { collab, sendableSteps, receiveTransaction } from 'prosemirror-collab';
import { EditorState } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import { getSteps, postSteps, resetDoc } from '@/services';
import { debounce } from '../useDebounce';
import type { CollabStep } from '@/services/types';
import { Node as ProseMirrorNode } from 'prosemirror-model';

export const useCollabEditor = (docId: string) => {
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
    autofocus: 'end',
    content: '',
  });

  useEffect(() => {
    if (!editor) return;

    let currentVersion = 0;

    const initCollab = async () => {
      try {
        const data = await getSteps(docId, 0);
        currentVersion = data.version || 0;

        const collabPlugin = collab({ version: currentVersion });
        let newState = EditorState.create({
          doc: editor.state.doc.type.createAndFill() as ProseMirrorNode,
          plugins: [...editor.state.plugins, collabPlugin],
        });

        if (data.steps?.length) {
          const steps = data.steps.map((s: CollabStep) =>
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
        const dataFetch = await getSteps(docId, currentVersion);

        if (dataFetch.version > currentVersion) {
          const steps = dataFetch.steps.map((s: CollabStep) =>
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

        await postSteps(docId, {
          version: sendable.version,
          steps: sendable.steps.map((s) => s.toJSON()),
          clientID: Number(sendable.clientID),
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes('409')) {
          const data = await getSteps(docId, currentVersion);
          const steps = data.steps.map((s: CollabStep) =>
            Step.fromJSON(editor.schema, s)
          );
          const tr = receiveTransaction(editor.state, steps, data.clientIDs);
          editor.view.dispatch(tr);
          currentVersion = data.version;
        } else {
          console.error('Sync error:', err);
        }
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
  }, [editor, docId]);

  useEffect(() => {
    if (!editor) return;

    const updateWordCount = () => {
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    };

    editor.on('update', updateWordCount);

    return () => {
      editor.off('update', updateWordCount);
    };
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

  const resetDocument = () => resetDoc(docId);

  return { editor, wordCount, setLink, resetDocument };
};
