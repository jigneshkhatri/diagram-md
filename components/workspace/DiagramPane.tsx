"use client";

import { Excalidraw, serializeAsJSON } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";

export interface DiagramPaneHandle {
  serialize(): string;
}

interface DiagramPaneProps {
  /** Raw `.excalidraw` scene JSON text for the document being opened. */
  initialSceneJSON: string;
  onReady?: (handle: DiagramPaneHandle) => void;
  onChange?: () => void;
}

export default function DiagramPane({ initialSceneJSON, onReady, onChange }: DiagramPaneProps) {
  let initialData: ExcalidrawInitialDataState | null = null;
  try {
    initialData = JSON.parse(initialSceneJSON) as ExcalidrawInitialDataState;
  } catch {
    initialData = null;
  }

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={(api: ExcalidrawImperativeAPI) => {
          onReady?.({
            serialize: () => serializeAsJSON(api.getSceneElements(), api.getAppState(), api.getFiles(), "local"),
          });
        }}
        initialData={initialData}
        onChange={() => onChange?.()}
      />
    </div>
  );
}
