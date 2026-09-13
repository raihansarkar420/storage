import {
  MoreVertical,
  Eye,
  Download,
  ArrowRightLeft,
  Edit2,
  Trash2,
  ArrowDownLeft,
} from 'lucide-react';
import { FileItem, SortOption } from '../types/storage';
import { formatBytes, formatDate } from '../lib/utils';
import FileIcon from './FileIcon';

interface FileListProps {
  items: FileItem[];
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpen: (item: FileItem) => void;
  onPreview: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
  onTransfer: (item: FileItem) => void;
  onRename: (item: FileItem) => void;
  onDelete: (item: FileItem) => void;
}

export default function FileList({
  items,
  sortOption,
  onSortChange,
  onOpen,
  onPreview,
  onDownload,
  onTransfer,
  onRename,
  onDelete,
}: FileListProps) {
  const toggleSort = (type: 'name' | 'date' | 'size') => {
    if (type === 'name') {
      onSortChange(sortOption === 'name-asc' ? 'name-desc' : 'name-asc');
    } else if (type === 'date') {
      onSortChange(sortOption === 'date-desc' ? 'date-asc' : 'date-desc');
    } else if (type === 'size') {
      onSortChange(sortOption === 'size-desc' ? 'size-asc' : 'size-desc');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
          <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            <tr>
              <th
                onClick={() => toggleSort('name')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Name {sortOption.startsWith('name') && (sortOption === 'name-asc' ? '↑' : '↓')}
              </th>
              <th className="py-3 px-4 hidden sm:table-cell">Type</th>
              <th
                onClick={() => toggleSort('size')}
                className="py-3 px-4 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Size {sortOption.startsWith('size') && (sortOption === 'size-asc' ? '↑' : '↓')}
              </th>
              <th
                onClick={() => toggleSort('date')}
                className="py-3 px-4 hidden md:table-cell cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Modified {sortOption.startsWith('date') && (sortOption === 'date-asc' ? '↑' : '↓')}
              </th>
              <th className="py-3 px-4 hidden lg:table-cell">Origin / Transfer</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map((item) => (
              <tr
                key={item.id}
                onClick={() => {
                  if (item.is_folder) {
                    onOpen(item);
                  } else {
                    onPreview(item);
                  }
                }}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group"
              >
                {/* Name & Icon */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-700/50">
                      <FileIcon type={item.type} name={item.name} isFolder={item.is_folder} className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-xs sm:max-w-md">
                      {item.name}
                    </span>
                  </div>
                </td>

                {/* Type */}
                <td className="py-3 px-4 hidden sm:table-cell text-zinc-400 capitalize">
                  {item.is_folder ? 'Folder' : item.type.split('/')[1] || item.name.split('.').pop() || 'File'}
                </td>

                {/* Size */}
                <td className="py-3 px-4 font-mono text-[11px] text-zinc-500">
                  {item.is_folder ? '—' : formatBytes(item.size)}
                </td>

                {/* Date */}
                <td className="py-3 px-4 hidden md:table-cell text-zinc-400">
                  {formatDate(item.updated_at || item.created_at)}
                </td>

                {/* Transfer Origin */}
                <td className="py-3 px-4 hidden lg:table-cell">
                  {item.is_transferred ? (
                    <span
                      title={`Transferred by ${item.original_owner_email || 'another user'}`}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    >
                      <ArrowDownLeft className="w-3 h-3" />
                      <span>{item.original_owner_email || 'Transferred'}</span>
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-[11px]">Direct Upload</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    {!item.is_folder && (
                      <button
                        onClick={() => onPreview(item)}
                        title="Preview"
                        className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {!item.is_folder && (
                      <button
                        onClick={() => onDownload(item)}
                        title="Download"
                        className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onTransfer(item)}
                      title="Transfer Ownership"
                      className="p-1.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRename(item)}
                      title="Rename"
                      className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      title="Delete"
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
