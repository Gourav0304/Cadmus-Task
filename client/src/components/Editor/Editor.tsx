import { useEffect, useState } from 'react';
import { EditorContent } from '@tiptap/react';
import { useCollabEditor } from '@/hooks';
import { EditorToolbar } from './EditorToolbar';

export const Editor = () => {
  const { editor, wordCount, setLink, resetDocument, activeTab } =
    useCollabEditor('main-docs');
  const [tabInfo, setTabInfo] = useState('');
  useEffect(() => {
    async function detectBrowser() {
      let browser = 'Unknown Browser';

      if (
        (navigator as any).brave &&
        (await (navigator as any).brave.isBrave())
      ) {
        browser = 'Brave';
      } else if (userAgent.includes('Edg')) {
        browser = 'Edge';
      } else if (userAgent.includes('Firefox')) {
        browser = 'Firefox';
      } else if (
        userAgent.includes('Safari') &&
        !userAgent.includes('Chrome')
      ) {
        browser = 'Safari';
      } else if (userAgent.includes('Chrome')) {
        browser = 'Chrome';
      }

      let tabId = sessionStorage.getItem('tabId');
      if (!tabId) {
        tabId = Math.floor(Math.random() * 10000).toString();
        sessionStorage.setItem('tabId', tabId);
      }

      setTabInfo(`${browser} - Tab ${tabId}`);
    }

    const userAgent = navigator.userAgent;
    detectBrowser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Cadmus Collaborative Editing Environment
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          This homework task involves building a collaborative rich-text editor
          using <strong>React, TypeScript</strong>, and the{' '}
          <strong>ProseMirror</strong> collaboration plugin via{' '}
          <strong>TipTap</strong>.
        </p>

        <EditorToolbar editor={editor} onSetLink={setLink} />

        <div
          className="border border-gray-200 rounded-lg min-h-52 p-4 
          focus-within:border-gray-400 focus-within:shadow-sm transition-all"
        >
          <EditorContent editor={editor} />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={resetDocument}
            className="text-xs text-red-500 underline mt-2"
          >
            Reset Document
          </button>

          <div className="text-xs text-gray-500 mt-2 text-center flex-1">
            {tabInfo}
            {activeTab && <div className="text-blue-500 mt-1">{activeTab}</div>}
          </div>

          <div className="text-sm text-gray-600 text-right mt-2">
            Word count: <span className="font-semibold">{wordCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
