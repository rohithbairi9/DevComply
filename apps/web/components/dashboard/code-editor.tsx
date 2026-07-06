'use client';

import Editor from '@monaco-editor/react';

export function CodeEditor({ value, language }: { value: string; language: string }) {
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      theme="vs-dark"
      value={value}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'off',
        scrollBeyondLastLine: false,
        padding: { top: 16 },
      }}
    />
  );
}