'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { editiorExtension } from './extensions';
import { MenuBar } from './MenuBar';

export function RichTextEditior() {
  const editior = useEditor({
    immediatelyRender: false,
    extensions: editiorExtension,
    editorProps: {
      attributes: {
        class:
          'max-w-none min-h-[125px] focus:outline-none p-4 !w-full !max-w-none prose dark:prose-invert marker:text-primary',
      },
    },
  });

  return (
    <div className="relative w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 flex flex-col">
      <MenuBar editor={editior} />
      <EditorContent
        editor={editior}
        className="max-h-[200px] overflow-y-auto"
      />
    </div>
  );
}
