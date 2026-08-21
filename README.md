# diagram-md

A browser-based tool for writing documentation and drawing diagrams side by side, saved directly to your local filesystem — no server, no database.

## What it does

- Each **project** is a folder on your computer, containing a `manifest.json` plus one `.md` file and one `.excalidraw` file per document.
- Each **document** pairs a Markdown file (edited with [MDX Editor](https://mdxeditor.dev)) with a diagram (drawn with [Excalidraw](https://excalidraw.com)), shown side by side in a resizable, collapsible split view.
- Everything is saved locally via the browser's File System Access API — you pick the folder, the app writes the files there.

## How it works

- Storage is behind a small provider interface (`lib/storage/`), currently backed by one implementation: your local filesystem. This keeps the door open for other backends (e.g. IndexedDB, a remote drive) later without changing the rest of the app.
- Project/document metadata lives in `manifest.json`; the actual content lives in plain `.md` and `.excalidraw` files next to it, so a project folder is readable and portable on its own.
- Saving is explicit — click **Save** to write the current document and diagram to disk.

## Requirements

- Chrome or Edge (the File System Access API isn't supported in Firefox or Safari yet).

## Running it

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Tech stack

Next.js (App Router) + TypeScript + Tailwind CSS, with `@mdxeditor/editor`, `@excalidraw/excalidraw`, and `react-resizable-panels` for the split-pane layout.
