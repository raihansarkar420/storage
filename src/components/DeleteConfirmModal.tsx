import { Trash2, AlertTriangle, X } from 'lucide-react';
import { FileItem } from '../types/storage';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FileItem | null;
  onConfirmDelete: (itemId: string) => void;
  allFiles: FileItem[];
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  item,
  onConfirmDelete,
  allFiles,
}: DeleteConfirmModalProps) {
  if (!isOpen || !item) return null;

  // Calculate number of children if it's a folder
  let descendantCount = 0;
  if (item.is_folder) {
    const countKids = (parentId: string) => {
      const kids = allFiles.filter((f) => f.parent_id === parentId);
      descendantCount += kids.length;
      kids.forEach((k) => {
        if (k.is_folder) countKids(k.id);
      });
    };
    countKids(item.id);
  }

  const handleDelete = () => {
    onConfirmDelete(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2">
            <Trash2 className="w-5 h-5" />
          </div>

          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Delete {item.is_folder ? 'Folder' : 'File'}?
          </h3>

          <p className="text-xs text-zinc-500 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-zinc-800 dark:text-zinc-200">"{item.name}"</span>?
          </p>

          {item.is_folder && descendantCount > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Cascaded Delete:</strong> This folder contains {descendantCount} nested item{descendantCount > 1 ? 's' : ''} that will also be permanently deleted.
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-1.5 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all shadow-xs"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
