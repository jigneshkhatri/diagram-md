"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Group, Panel, Separator, type PanelImperativeHandle } from "react-resizable-panels";
import DocumentSidebar from "@/components/workspace/DocumentSidebar";
import Toolbar from "@/components/workspace/Toolbar";
import type { DocumentPaneHandle } from "@/components/workspace/DocumentPane";
import type { DiagramPaneHandle } from "@/components/workspace/DiagramPane";
import { providers } from "@/lib/storage";
import { listProjects, touchProject } from "@/lib/storage/registry";
import {
  EMPTY_DIAGRAM,
  createDocument,
  deleteDocument as deleteDocumentOp,
  renameDocument,
  saveDocument,
} from "@/lib/storage/document-ops";
import type { ProjectManifest } from "@/lib/types";
import type { DocumentContent, ProjectStorage } from "@/lib/storage/types";

const DocumentPane = dynamic(() => import("@/components/workspace/DocumentPane"), { ssr: false });
const DiagramPane = dynamic(() => import("@/components/workspace/DiagramPane"), { ssr: false });

const AUTOSAVE_DELAY_MS = 1500;

interface WorkspaceProps {
  projectId: string;
}

export default function Workspace({ projectId }: WorkspaceProps) {
  const [storage, setStorage] = useState<ProjectStorage | null>(null);
  const [manifest, setManifest] = useState<ProjectManifest | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const manifestRef = useRef<ProjectManifest | null>(null);
  useEffect(() => {
    manifestRef.current = manifest;
  }, [manifest]);

  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [docContent, setDocContent] = useState<{ docId: string; content: DocumentContent } | null>(null);
  const currentContent = docContent?.docId === selectedDocId ? docContent.content : null;
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autosaveEnabled, setAutosaveEnabled] = useState(false);

  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const documentHandleRef = useRef<DocumentPaneHandle | null>(null);
  const diagramHandleRef = useRef<DiagramPaneHandle | null>(null);
  const docPanelRef = useRef<PanelImperativeHandle | null>(null);
  const diagramPanelRef = useRef<PanelImperativeHandle | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await listProjects();
      const entry = entries.find((e) => e.id === projectId);
      if (!entry) {
        if (!cancelled) setLoadError("Project not found in this browser's registry.");
        return;
      }
      const provider = providers[entry.providerId];
      if (!provider) {
        if (!cancelled) setLoadError(`Unknown storage provider: ${entry.providerId}`);
        return;
      }
      try {
        const openedStorage = await provider.openProject(entry);
        const openedManifest = await openedStorage.readManifest();
        await touchProject(entry.id);
        if (!cancelled) {
          setStorage(openedStorage);
          setManifest(openedManifest);
          setSelectedDocId(openedManifest.documents[0]?.id ?? null);
        }
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "Failed to open project.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  useEffect(() => {
    if (!storage || !selectedDocId) return;
    const doc = manifestRef.current?.documents.find((d) => d.id === selectedDocId);
    if (!doc) return;
    let cancelled = false;
    storage.readDocument(doc).then((content) => {
      if (!cancelled) {
        setDocContent({ docId: selectedDocId, content });
        setDirty(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [storage, selectedDocId]);

  function handleSelectDocument(id: string) {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    setSelectedDocId(id);
  }

  const handleSave = useCallback(async () => {
    if (!storage || !manifest || !selectedDocId) return;
    const content: DocumentContent = {
      markdown: documentHandleRef.current?.getMarkdown() ?? "",
      diagram: diagramHandleRef.current?.serialize() ?? EMPTY_DIAGRAM,
    };
    setSaving(true);
    try {
      const updated = await saveDocument(storage, manifest, selectedDocId, content);
      setManifest(updated);
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }, [storage, manifest, selectedDocId]);

  useEffect(() => {
    if (!autosaveEnabled || !dirty) return;
    const timer = setTimeout(handleSave, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [autosaveEnabled, dirty, handleSave]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (!autosaveEnabled) handleSave();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [autosaveEnabled, handleSave]);

  async function handleCreateDocument() {
    if (!storage || !manifest) return;
    const title = window.prompt("Document title", "Untitled")?.trim();
    if (!title) return;
    const updated = await createDocument(storage, manifest, title);
    setManifest(updated);
    setSelectedDocId(updated.documents[updated.documents.length - 1].id);
  }

  async function handleRenameDocument(id: string) {
    if (!storage || !manifest) return;
    const current = manifest.documents.find((d) => d.id === id);
    const title = window.prompt("Rename document", current?.title)?.trim();
    if (!title) return;
    setManifest(await renameDocument(storage, manifest, id, title));
  }

  async function handleDeleteDocument(id: string) {
    if (!storage || !manifest) return;
    if (!window.confirm("Delete this document? This cannot be undone.")) return;
    const updated = await deleteDocumentOp(storage, manifest, id);
    setManifest(updated);
    if (selectedDocId === id) setSelectedDocId(updated.documents[0]?.id ?? null);
  }

  if (loadError) {
    return <p className="p-6 text-sm text-red-700 dark:text-red-300">{loadError}</p>;
  }

  if (!manifest) {
    return <p className="p-6 text-sm text-black/50 dark:text-white/50">Loading project…</p>;
  }

  return (
    <div className="flex h-screen flex-col">
      <Toolbar
        projectName={manifest.name}
        dirty={dirty}
        saving={saving}
        onSave={handleSave}
        autosaveEnabled={autosaveEnabled}
        onToggleAutosave={setAutosaveEnabled}
        onToggleDocumentPane={() => {
          const p = docPanelRef.current;
          if (p?.isCollapsed()) p.expand();
          else p?.collapse();
        }}
        onToggleDiagramPane={() => {
          const p = diagramPanelRef.current;
          if (p?.isCollapsed()) p.expand();
          else p?.collapse();
        }}
      />
      <div className="min-h-0 flex-1">
        <Group orientation={isNarrow ? "vertical" : "horizontal"}>
          <Panel id="sidebar" defaultSize="18" minSize="12" maxSize="30" collapsible collapsedSize="0">
            <DocumentSidebar
              documents={manifest.documents}
              selectedId={selectedDocId}
              onSelect={handleSelectDocument}
              onCreate={handleCreateDocument}
              onRename={handleRenameDocument}
              onDelete={handleDeleteDocument}
            />
          </Panel>
          <Separator className={isNarrow ? "h-1 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20" : "w-1 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"} />
          <Panel id="document" panelRef={docPanelRef} defaultSize="41" minSize="15" collapsible collapsedSize="0">
            {currentContent && selectedDocId ? (
              <DocumentPane
                key={selectedDocId}
                initialMarkdown={currentContent.markdown}
                onReady={(handle) => {
                  documentHandleRef.current = handle;
                }}
                onChange={() => setDirty(true)}
              />
            ) : (
              <p className="p-6 text-sm text-black/40 dark:text-white/40">Select or create a document.</p>
            )}
          </Panel>
          <Separator className={isNarrow ? "h-1 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20" : "w-1 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"} />
          <Panel id="diagram" panelRef={diagramPanelRef} defaultSize="41" minSize="15" collapsible collapsedSize="0">
            {currentContent && selectedDocId ? (
              <DiagramPane
                key={selectedDocId}
                initialSceneJSON={currentContent.diagram}
                onReady={(handle) => {
                  diagramHandleRef.current = handle;
                }}
                onChange={() => setDirty(true)}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-black/40 dark:text-white/40">
                Select or create a document.
              </div>
            )}
          </Panel>
        </Group>
      </div>
    </div>
  );
}
