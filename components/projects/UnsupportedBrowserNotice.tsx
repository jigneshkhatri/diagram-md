export default function UnsupportedBrowserNotice() {
  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
      <p className="font-medium">No storage backend available in this browser.</p>
      <p className="mt-1">
        diagram-md saves projects to a folder on your computer using the File System Access API, which is currently
        only supported in Chrome and Edge. Open this app in one of those browsers to create or open a project.
      </p>
    </div>
  );
}
