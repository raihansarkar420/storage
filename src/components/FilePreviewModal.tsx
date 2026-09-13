import { useState } from 'react';
import {
  X,
  Download,
  ArrowRightLeft,
  Calendar,
  HardDrive,
  User,
  FileText,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { FileItem } from '../types/storage';
import { formatBytes, formatDate, getFileTypeCategory } from '../lib/utils';
import FileIcon from './FileIcon';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FileItem | null;
  onDownload: (item: FileItem) => void;
  onTransfer: (item: FileItem) => void;
}

export default function FilePreviewModal({
  isOpen,
  onClose,
  item,
  onDownload,
  onTransfer,
}: FilePreviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const category = getFileTypeCategory(item.type, item.name);

  const handleCopyContent = () => {
    if (item.content_preview) {
      navigator.clipboard.writeText(item.content_preview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 truncate">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200/50 dark:border-zinc-700">
              <FileIcon type={item.type} name={item.name} isFolder={item.is_folder} className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {item.name}
              </h2>
              <p className="text-[11px] text-zinc-500 font-mono">
                {item.type} • {formatBytes(item.size)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTransfer(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Transfer</span>
            </button>
            <button
              onClick={() => onDownload(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body & Metadata Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Preview (2 cols) */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 min-h-[320px] overflow-hidden">
            {category === 'image' && item.content_preview ? (
              <div className="w-full h-full flex items-center justify-center max-h-[480px]">
                <img
                  src={item.content_preview}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="max-h-[440px] max-w-full rounded-xl object-contain shadow-sm"
                />
              </div>
            ) : category === 'pdf' ? (
              <div className="w-full h-full max-h-[480px] flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
                <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 flex items-center justify-between text-xs border-b border-zinc-200 dark:border-zinc-700">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-rose-500" />
                    <span>PDF Document Preview</span>
                  </span>
                  <span className="text-[11px] text-zinc-400">Page 1 of 1</span>
                </div>
                <div className="p-6 font-serif text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap overflow-y-auto">
                  {item.content_preview || 'PDF Document Binary Payload'}
                </div>
              </div>
            ) : category === 'code' || category === 'document' ? (
              <div className="w-full h-full max-h-[480px] flex flex-col bg-zinc-900 text-zinc-100 rounded-xl overflow-hidden shadow-inner">
                <div className="bg-zinc-800 px-4 py-2 flex items-center justify-between text-xs border-b border-zinc-700">
                  <span className="font-mono text-zinc-400">{item.name}</span>
                  <button
                    onClick={handleCopyContent}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 font-mono text-xs text-zinc-200 overflow-auto whitespace-pre-wrap leading-relaxed">
                  {item.content_preview || '// No direct text preview available for binary file.'}
                </pre>
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-400">
                  <FileIcon type={item.type} name={item.name} isFolder={item.is_folder} className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Preview not rendered for this format
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  You can download the raw file to open on your machine.
                </p>
              </div>
            )}
          </div>

          {/* Metadata Details Inspector (1 col) */}
          <div className="space-y-4">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-200/80 dark:border-zinc-800 space-y-3">
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                File Details
              </h3>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase">Storage Path</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300 break-all text-[11px]">
                    {item.storage_path || 'Virtual Root Folder'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Size</span>
                  <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">
                    {formatBytes(item.size)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Created</span>
                  <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                    {formatDate(item.created_at)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Owner Email</span>
                  <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300 truncate max-w-[140px]">
                    {item.owner_email || 'Current User'}
                  </span>
                </div>

                {item.is_transferred && (
                  <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Transferred Item</span>
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Transferred by: <span className="font-mono text-zinc-700 dark:text-zinc-300">{item.original_owner_email}</span>
                    </div>
                    {item.transferred_at && (
                      <div className="text-[11px] text-zinc-400">
                        Date: {formatDate(item.transferred_at)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Supabase Storage Bucket Badge */}
            <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-emerald-500" />
              <div className="truncate">
                <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-[11px]">
                  Bucket: user_storage
                </p>
                <p className="text-[10px] text-zinc-400">
                  Protected with Supabase RLS policies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
