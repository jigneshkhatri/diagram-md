"use client";

import { useRef } from "react";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

export interface DocumentPaneHandle {
  getMarkdown(): string;
}

interface DocumentPaneProps {
  initialMarkdown: string;
  onReady?: (handle: DocumentPaneHandle) => void;
  onChange?: () => void;
}

export default function DocumentPane({ initialMarkdown, onReady, onChange }: DocumentPaneProps) {
  const editorRef = useRef<MDXEditorMethods>(null);

  return (
    <div className="h-full w-full overflow-y-auto">
      <MDXEditor
        ref={(instance) => {
          editorRef.current = instance;
          if (instance) {
            onReady?.({ getMarkdown: () => instance.getMarkdown() });
          }
        }}
        markdown={initialMarkdown}
        onChange={() => onChange?.()}
        contentEditableClassName="prose max-w-none min-h-full px-4 py-3"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <ListsToggle />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
}
