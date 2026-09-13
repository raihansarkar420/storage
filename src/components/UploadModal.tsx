import { useState, useRef, type DragEvent, type FormEvent } from 'react';
import { X, Upload, FolderPlus, CheckCircle2 } from 'lucide-react';
import { formatBytes } from '../lib/utils';
import FileIcon from './FileIcon';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab: 'upload' | 'folder';
  currentFolderId: string | null;
  onUploadFiles: (files: { file: File; preview: string }[]) => void;
  onCreateFolder: (name: string) => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  defaultTab,
  currentFolderId,
  onUploadFiles,
  onCreateFolder,
}: UploadModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'folder'>(defaultTab);
  const [folderName, setFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; preview: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle files selected via input or drag
  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);
    const newSelected: { file: File; preview: string }[] = [];

    let processedCount = 0;
    filesArray.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newSelected.push({ file, preview: (e.target?.result as string) || '' });
          processedCount++;
          if (processedCount === filesArray.length) {
            setSelectedFiles((prev) => [...prev, ...newSelected]);
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type.includes('text') || file.name.endsWith('.md') || file.name.endsWith('.json') || file.name.endsWith('.js') || file.name.endsWith('.ts')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newSelected.push({ file, preview: (e.target?.result as string) || '' });
          processedCount++;
          if (processedCount === filesArray.length) {
            setSelectedFiles((prev) => [...prev, ...newSelected]);
          }
        };
        reader.readAsText(file);
      } else {
        newSelected.push({ file, preview: '' });
        processedCount++;
        if (processedCount === filesArray.length) {
          setSelectedFiles((prev) => [...prev, ...newSelected]);
        }
      }
    });
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmitUpload = () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      onUploadFiles(selectedFiles);
      setSelectedFiles([]);
      setIsProcessing(false);
      onClose();
    }, 400);
  };

  const handleSubmitFolder = (e: FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    onCreateFolder(folderName.trim());
    setFolderName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                activeTab === 'upload'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Upload Files
            </button>
            <button
              onClick={() => setActiveTab('folder')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                activeTab === 'folder'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              New Folder
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab 1: Upload Files */}
        {activeTab === 'upload' ? (
          <div className="p-6 space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-800/60 scale-[0.99]'
                  : 'border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-800/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-zinc-600 dark:text-zinc-300">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Click to browse or drag & drop files
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Images (PNG, JPG), Documents (PDF, DOCX), Code, Audio, Video
              </p>
            </div>

            {/* Selected Files Queue */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Ready to upload ({selectedFiles.length})
                </div>
                {selectedFiles.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-100 dark:border-zinc-700/50 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileIcon type={item.file.type} name={item.file.name} isFolder={false} className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[240px]">
                        {item.file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-zinc-400 font-mono text-[11px]">
                        {formatBytes(item.file.size)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="text-zinc-400 hover:text-rose-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedFiles.length === 0 || isProcessing}
                onClick={handleSubmitUpload}
                className="px-5 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 disabled:opacity-50 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900 rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Tab 2: Create Folder */
          <form onSubmit={handleSubmitFolder} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
                Folder Name
              </label>
              <div className="relative">
                <FolderPlus className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Invoices 2026, Wireframes, Marketing"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all text-zinc-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!folderName.trim()}
                className="px-5 py-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 disabled:opacity-50 rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Create Folder
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
