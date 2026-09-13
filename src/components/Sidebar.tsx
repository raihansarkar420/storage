import {
  HardDrive,
  FolderOpen,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Plus,
  Image as ImageIcon,
  FileText,
  Film,
  Code,
  FolderPlus,
  Upload,
  Layers,
} from 'lucide-react';
import { FilterType, StorageStats, StorageTab } from '../types/storage';
import { formatBytes } from '../lib/utils';

interface SidebarProps {
  currentTab: StorageTab;
  onSelectTab: (tab: StorageTab) => void;
  currentFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  stats: StorageStats;
  onOpenUploadModal: (defaultTab: 'upload' | 'folder') => void;
  transfersInCount: number;
  transfersOutCount: number;
}

export default function Sidebar({
  currentTab,
  onSelectTab,
  currentFilter,
  onSelectFilter,
  stats,
  onOpenUploadModal,
  transfersInCount,
  transfersOutCount,
}: SidebarProps) {
  const percentUsed = Math.min(100, Math.round((stats.usedBytes / stats.totalBytes) * 100));

  const navTabs = [
    {
      id: 'my-files' as StorageTab,
      label: 'My Storage',
      icon: HardDrive,
      badge: stats.filesCount + stats.foldersCount,
    },
    {
      id: 'transferred-in' as StorageTab,
      label: 'Transferred to Me',
      icon: ArrowDownLeft,
      badge: transfersInCount > 0 ? transfersInCount : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      id: 'transferred-out' as StorageTab,
      label: 'Transfer History',
      icon: ArrowUpRight,
      badge: transfersOutCount > 0 ? transfersOutCount : undefined,
    },
    {
      id: 'recent' as StorageTab,
      label: 'Recent Files',
      icon: Clock,
    },
  ];

  const filterCategories = [
    { id: 'all' as FilterType, label: 'All Items', icon: Layers },
    { id: 'folders' as FilterType, label: 'Folders', icon: FolderOpen, count: stats.foldersCount },
    { id: 'images' as FilterType, label: 'Images', icon: ImageIcon, size: stats.categories.images },
    { id: 'documents' as FilterType, label: 'Documents & PDFs', icon: FileText, size: stats.categories.documents },
    { id: 'media' as FilterType, label: 'Audio & Video', icon: Film, size: stats.categories.media },
    { id: 'code' as FilterType, label: 'Code & Text', icon: Code, size: stats.categories.code },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      {/* Upload Action Group */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onOpenUploadModal('upload')}
          className="flex-1 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Files</span>
        </button>
        <button
          onClick={() => onOpenUploadModal('folder')}
          title="Create New Folder"
          className="p-2.5 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 transition-colors shadow-xs cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation Tabs */}
      <div className="space-y-1">
        <div className="px-3 pb-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          Storage Explorer
        </div>
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-inherit' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
              </div>
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-md ${
                    tab.badgeColor || (isActive ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500')
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category Filter Group */}
      {currentTab === 'my-files' && (
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Categories
          </div>
          {filterCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = currentFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectFilter(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-xl transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </div>
                {cat.size !== undefined && cat.size > 0 && (
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {formatBytes(cat.size)}
                  </span>
                )}
                {cat.count !== undefined && cat.count > 0 && (
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Storage Quota Card */}
      <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
            <span>Storage Used</span>
          </span>
          <span className="font-mono text-[11px] text-zinc-500">
            {percentUsed}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentUsed > 85 ? 'bg-rose-500' : percentUsed > 60 ? 'bg-amber-500' : 'bg-zinc-900 dark:bg-zinc-100'
            }`}
            style={{ width: `${Math.max(percentUsed, 2)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>{formatBytes(stats.usedBytes)}</span>
          <span>of {formatBytes(stats.totalBytes)}</span>
        </div>
      </div>
    </aside>
  );
}
