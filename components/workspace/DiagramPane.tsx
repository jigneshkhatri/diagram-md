"use client";

import { useRef } from "react";
import { Excalidraw, serializeAsJSON } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
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

function elementsSignature(elements: readonly ExcalidrawElement[]): string {
  return elements.map((el) => `${el.id}:${el.version}`).join(",");
}

export default function DiagramPane({ initialSceneJSON, onReady, onChange }: DiagramPaneProps) {
  const lastSignatureRef = useRef<string | null>(null);

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
          lastSignatureRef.current = elementsSignature(api.getSceneElements());
          onReady?.({
            serialize: () => serializeAsJSON(api.getSceneElements(), api.getAppState(), api.getFiles(), "local"),
          });
        }}
        initialData={initialData}
        onChange={(elements) => {
          // Excalidraw fires onChange on purely cosmetic appState changes too
          // (selection, scroll, zoom) — only treat it as an edit when an
          // element's own version actually changed.
          const signature = elementsSignature(elements);
          if (signature !== lastSignatureRef.current) {
            lastSignatureRef.current = signature;
            onChange?.();
          }
        }}
      />
    </div>
  );
}
