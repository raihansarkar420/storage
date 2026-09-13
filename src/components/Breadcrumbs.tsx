import { ChevronRight, Home, Folder } from 'lucide-react';
import { FileItem } from '../types/storage';

interface BreadcrumbsProps {
  currentFolderId: string | null;
  allFiles: FileItem[];
  onNavigate: (folderId: string | null) => void;
}

export default function Breadcrumbs({
  currentFolderId,
  allFiles,
  onNavigate,
}: BreadcrumbsProps) {
  // Build breadcrumb trail by walking up parent_id
  const trail: { id: string | null; name: string }[] = [];

  let currId = currentFolderId;
  while (currId) {
    const folder = allFiles.find((f) => f.id === currId);
    if (folder) {
      trail.unshift({ id: folder.id, name: folder.name });
      currId = folder.parent_id;
    } else {
      break;
    }
  }

  return (
    <nav className="flex items-center gap-1.5 text-xs text-zinc-500 overflow-x-auto py-1">
      <button
        onClick={() => onNavigate(null)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
          currentFolderId === null
            ? 'font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800'
            : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
        }`}
      >
        <Home className="w-3.5 h-3.5" />
        <span>Root Storage</span>
      </button>

      {trail.map((crumb, idx) => {
        const isLast = idx === trail.length - 1;
        return (
          <div key={crumb.id || idx} className="flex items-center gap-1.5 shrink-0">
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <button
              onClick={() => onNavigate(crumb.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                isLast
                  ? 'font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-zinc-400" />
              <span className="max-w-[150px] truncate">{crumb.name}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
