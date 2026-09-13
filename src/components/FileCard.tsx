import { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Eye,
  Download,
  ArrowRightLeft,
  Edit2,
  Trash2,
  Folder,
  ArrowDownLeft,
} from 'lucide-react';
import { FileItem } from '../types/storage';
import { formatBytes, formatDate } from '../lib/utils';
import FileIcon from './FileIcon';

interface FileCardProps {
  item: FileItem;
  onOpen: (item: FileItem) => void;
  onPreview: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
  onTransfer: (item: FileItem) => void;
  onRename: (item: FileItem) => void;
  onDelete: (item: FileItem) => void;
}

export default function FileCard({
  item,
  onOpen,
  onPreview,
  onDownload,
  onTransfer,
  onRename,
  onDelete,
}: FileCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const isImage = item.type.includes('image') && item.content_preview?.startsWith('http');

  return (
    <div
      onClick={() => {
        if (item.is_folder) {
          onOpen(item);
        } else {
          onPreview(item);
        }
      }}
      className="group relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-4 transition-all duration-150 hover:shadow-md cursor-pointer flex flex-col justify-between select-none"
    >
      {/* Top Bar: Icon & Options Menu */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 flex items-center justify-center border border-zinc-100 dark:border-zinc-700/60 shrink-0">
          <FileIcon type={item.type} name={item.name} isFolder={item.is_folder} className="w-5 h-5" />
        </div>

        {/* Transfer Badge if received */}
        {item.is_transferred && (
          <span
            title={`Transferred by ${item.original_owner_email || 'another user'}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
          >
            <ArrowDownLeft className="w-3 h-3" />
            <span className="truncate max-w-[80px]">Received</span>
          </span>
        )}

        {/* Action Dropdown */}
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          className="relative ml-auto"
        >
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-1.5 z-30 text-xs animate-in fade-in zoom-in-95 duration-100">
              {!item.is_folder && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onPreview(item);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Eye className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Preview</span>
                </button>
              )}

              {!item.is_folder && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDownload(item);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Download</span>
                </button>
              )}

              {/* Transfer Ownership */}
              <button
                onClick={() => {
                  setShowMenu(false);
                  onTransfer(item);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-medium"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Transfer Ownership</span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  onRename(item);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <Edit2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Rename</span>
              </button>

              <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete(item);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Visual Thumbnail (if image) */}
      {isImage ? (
        <div className="w-full h-28 mb-3 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
          <img
            src={item.content_preview}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : item.content_preview && item.type.includes('markdown') ? (
        <div className="w-full h-20 mb-3 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60 overflow-hidden text-[10px] font-mono text-zinc-500 leading-tight select-none">
          {item.content_preview.slice(0, 100)}...
        </div>
      ) : null}

      {/* Name and Metadata */}
      <div>
        <h3
          title={item.name}
          className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors"
        >
          {item.name}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
          <span>{item.is_folder ? 'Folder' : formatBytes(item.size)}</span>
          <span>{formatDate(item.updated_at || item.created_at).split(',')[0]}</span>
        </div>
      </div>
    </div>
  );
}
