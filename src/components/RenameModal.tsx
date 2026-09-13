import { useState, useEffect, type FormEvent } from 'react';
import { X, Edit2 } from 'lucide-react';
import { FileItem } from '../types/storage';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FileItem | null;
  onRenameSubmit: (itemId: string, newName: string) => void;
}

export default function RenameModal({
  isOpen,
  onClose,
  item,
  onRenameSubmit,
}: RenameModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onRenameSubmit(item.id, name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-zinc-500" />
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Rename {item.is_folder ? 'Folder' : 'File'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
              New Name
            </label>
            <input
              type="text"
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || name === item.name}
              className="px-4 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 disabled:opacity-50 rounded-xl transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
