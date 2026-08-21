"use client";

import { useRef } from "react";
import { highlightActiveLine, highlightActiveLineGutter, lineNumbers } from "@codemirror/view";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  frontmatterPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  DiffSourceToggleWrapper,
  UndoRedo,
  BoldItalicUnderlineToggles,
  StrikeThroughSupSubToggles,
  CodeToggle,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  InsertFrontmatter,
  ChangeCodeMirrorLanguage,
  ConditionalContents,
  Separator,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

const CODE_BLOCK_LANGUAGES = {
  txt: "Plain text",
  js: "JavaScript",
  jsx: "JavaScript (JSX)",
  ts: "TypeScript",
  tsx: "TypeScript (JSX)",
  css: "CSS",
  html: "HTML",
  json: "JSON",
  python: "Python",
  bash: "Bash",
  md: "Markdown",
};

const CODE_MIRROR_EXTENSIONS = [lineNumbers(), highlightActiveLine(), highlightActiveLineGutter()];

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
        onChange={(_markdown, initialMarkdownNormalize) => {
          if (!initialMarkdownNormalize) onChange?.();
        }}
        contentEditableClassName="prose max-w-none min-h-full px-4 py-3"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          tablePlugin(),
          frontmatterPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
          codeMirrorPlugin({ codeBlockLanguages: CODE_BLOCK_LANGUAGES, codeMirrorExtensions: CODE_MIRROR_EXTENSIONS }),
          diffSourcePlugin({ viewMode: "rich-text", codeMirrorExtensions: CODE_MIRROR_EXTENSIONS }),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper>
                <ConditionalContents
                  options={[
                    { when: (editor) => editor?.editorType === "codeblock", contents: () => <ChangeCodeMirrorLanguage /> },
                    {
                      fallback: () => (
                        <>
                          <UndoRedo />
                          <Separator />
                          <BoldItalicUnderlineToggles />
                          <StrikeThroughSupSubToggles />
                          <CodeToggle />
                          <Separator />
                          <BlockTypeSelect />
                          <Separator />
                          <ListsToggle />
                          <Separator />
                          <CreateLink />
                          <InsertImage />
                          <InsertTable />
                          <InsertThematicBreak />
                          <InsertCodeBlock />
                          <InsertFrontmatter />
                        </>
                      ),
                    },
                  ]}
                />
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
      />
    </div>
  );
}
