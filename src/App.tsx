import { useState, useEffect, useMemo } from 'react';
import {
  FileItem,
  FilterType,
  Profile,
  SortOption,
  StorageStats,
  StorageTab,
  ViewMode,
} from './types/storage';
import { StorageService } from './lib/storageEngine';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs';
import FileCard from './components/FileCard';
import FileList from './components/FileList';
import UploadModal from './components/UploadModal';
import TransferModal from './components/TransferModal';
import FilePreviewModal from './components/FilePreviewModal';
import RenameModal from './components/RenameModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import SqlAndCodeModal from './components/SqlAndCodeModal';
import SettingsModal from './components/SettingsModal';
import LoginView from './components/LoginView';
import TransfersView from './components/TransfersView';
import {
  FolderOpen,
  Upload,
  FolderPlus,
  ArrowUpDown,
  Search,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Clock,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';
import { getFileTypeCategory } from './lib/utils';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    return StorageService.getCurrentUser();
  });

  // Storage Data
  const [files, setFiles] = useState<FileItem[]>(() => StorageService.getFiles());
  const [transfers, setTransfers] = useState(() => StorageService.getTransfers());
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

  // Navigation & Filtering State
  const [currentTab, setCurrentTab] = useState<StorageTab>('my-files');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadModalTab, setUploadModalTab] = useState<'upload' | 'folder'>('upload');
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedItemForTransfer, setSelectedItemForTransfer] = useState<FileItem | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedItemForPreview, setSelectedItemForPreview] = useState<FileItem | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [selectedItemForRename, setSelectedItemForRename] = useState<FileItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemForDelete, setSelectedItemForDelete] = useState<FileItem | null>(null);
  const [sqlModalOpen, setSqlModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Toast Banner
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Synchronize state when storage updates
  const refreshData = () => {
    setFiles(StorageService.getFiles());
    setTransfers(StorageService.getTransfers());
  };

  // Compute User Storage Stats
  const stats: StorageStats = useMemo(() => {
    if (!currentUser) {
      return {
        usedBytes: 0,
        totalBytes: 1024 * 1024 * 1024,
        filesCount: 0,
        foldersCount: 0,
        categories: { images: 0, documents: 0, media: 0, code: 0, others: 0 },
      };
    }
    return StorageService.calculateStorageStats(currentUser.id);
  }, [currentUser, files]);

  // Transferred counts
  const transfersInCount = useMemo(() => {
    if (!currentUser) return 0;
    return files.filter((f) => f.owner_id === currentUser.id && f.is_transferred).length;
  }, [currentUser, files]);

  const transfersOutCount = useMemo(() => {
    if (!currentUser) return 0;
    return transfers.filter((t) => t.sender_id === currentUser.id).length;
  }, [currentUser, transfers]);

  // Filter & Sort Items for Active Tab View
  const displayItems = useMemo(() => {
    if (!currentUser) return [];

    let filtered = files.filter((f) => f.owner_id === currentUser.id);

    if (currentTab === 'my-files') {
      if (searchQuery.trim()) {
        // Search across all folders
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter((f) => f.name.toLowerCase().includes(q));
      } else {
        // Filter by folder hierarchy
        filtered = filtered.filter((f) => f.parent_id === currentFolderId);
      }

      // Filter by category
      if (currentFilter !== 'all') {
        filtered = filtered.filter((f) => {
          if (currentFilter === 'folders') return f.is_folder;
          if (f.is_folder) return false;
          const cat = getFileTypeCategory(f.type, f.name);
          return cat === currentFilter;
        });
      }
    } else if (currentTab === 'transferred-in') {
      filtered = filtered.filter((f) => f.is_transferred);
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter((f) => f.name.toLowerCase().includes(q));
      }
    } else if (currentTab === 'recent') {
      filtered = filtered.filter((f) => !f.is_folder);
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter((f) => f.name.toLowerCase().includes(q));
      }
    }

    // Apply Sorting
    return [...filtered].sort((a, b) => {
      // Always put folders first in grid/list unless sorting by size/date specifically
      if (a.is_folder && !b.is_folder && sortOption.startsWith('name')) return -1;
      if (!a.is_folder && b.is_folder && sortOption.startsWith('name')) return 1;

      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.updated_at || a.created_at).getTime() - new Date(b.updated_at || b.created_at).getTime();
        case 'date-desc':
          return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime();
        case 'size-asc':
          return a.size - b.size;
        case 'size-desc':
          return b.size - a.size;
        default:
          return 0;
      }
    });
  }, [currentUser, files, currentFolderId, currentTab, currentFilter, searchQuery, sortOption]);

  // Handlers
  const handleOpenFolder = (folder: FileItem) => {
    setCurrentFolderId(folder.id);
  };

  const handleCreateFolder = (name: string) => {
    if (!currentUser) return;
    const newFolder = StorageService.createFolder(name, currentFolderId, currentUser);
    refreshData();
    showToast(`Folder "${newFolder.name}" created successfully`);
  };

  const handleUploadFiles = (uploaded: { file: File; preview: string }[]) => {
    if (!currentUser) return;
    uploaded.forEach((item) => {
      StorageService.uploadFile(item.file, item.preview, currentFolderId, currentUser);
    });
    refreshData();
    showToast(`Uploaded ${uploaded.length} file${uploaded.length > 1 ? 's' : ''} to storage`);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!currentUser) return;
    const result = StorageService.deleteItem(itemId, currentUser);
    refreshData();
    showToast(
      `Deleted ${result.deletedCount} item${result.deletedCount > 1 ? 's' : ''}`,
      'info'
    );
  };

  const handleRenameItem = (itemId: string, newName: string) => {
    if (!currentUser) return;
    StorageService.renameItem(itemId, newName, currentUser);
    refreshData();
    showToast('Item renamed successfully');
  };

  const handleDownloadItem = (item: FileItem) => {
    if (item.is_folder) return;
    const content = item.content_preview || 'Personal Cloud Storage File Content';
    const blob = new Blob([content], { type: item.type || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloading "${item.name}"`);
  };

  const handleTransferClick = (item: FileItem) => {
    setSelectedItemForTransfer(item);
    setTransferModalOpen(true);
  };

  const handleTransferSuccess = (result: { message: string; recipientEmail: string }) => {
    refreshData();
    showToast(result.message, 'success');
  };

  const handleSwitchUser = (newUser: Profile) => {
    StorageService.setCurrentUser(newUser);
    setCurrentUser(newUser);
    setCurrentFolderId(null);
    setCurrentTab('my-files');
    refreshData();
    showToast(`Switched account to ${newUser.email}`, 'info');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleResetDatabase = () => {
    const fresh = StorageService.resetToDefault();
    setFiles(fresh.files);
    setTransfers(fresh.transfers);
    setCurrentUser(fresh.user);
    setCurrentFolderId(null);
    showToast('Interactive Sandbox restored to default sample data', 'info');
  };

  // If not logged in, render the Passwordless Login View
  if (!currentUser) {
    return (
      <LoginView
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          refreshData();
          showToast(`Welcome, ${user.email}!`, 'success');
        }}
        onOpenSqlModal={() => setSqlModalOpen(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col text-zinc-900 dark:text-zinc-100">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-medium ${
              toast.type === 'success'
                ? 'bg-zinc-900 text-white border-zinc-800 dark:bg-zinc-100 dark:text-zinc-900'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-indigo-600 text-white border-indigo-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onLogout={handleLogout}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSqlModal={() => setSqlModalOpen(true)}
        onOpenSettingsModal={() => setSettingsModalOpen(true)}
        isSupabaseConnected={!!StorageService.getClient()}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              if (tab !== 'my-files') {
                setCurrentFolderId(null);
              }
            }}
            currentFilter={currentFilter}
            onSelectFilter={setCurrentFilter}
            stats={stats}
            onOpenUploadModal={(tab) => {
              setUploadModalTab(tab);
              setUploadModalOpen(true);
            }}
            transfersInCount={transfersInCount}
            transfersOutCount={transfersOutCount}
          />

          {/* Right Main Content Panel */}
          <section className="flex-1 min-w-0 space-y-6">
            {/* View Switch: Files View vs Transfer Audit View */}
            {currentTab === 'transferred-out' ? (
              <TransfersView
                transfers={transfers}
                currentUser={currentUser}
                filterType="out"
              />
            ) : (
              <>
                {/* Control Header: Breadcrumbs & Sort Toggles */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                  {currentTab === 'my-files' ? (
                    <Breadcrumbs
                      currentFolderId={currentFolderId}
                      allFiles={files.filter((f) => f.owner_id === currentUser.id)}
                      onNavigate={setCurrentFolderId}
                    />
                  ) : currentTab === 'transferred-in' ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      <ArrowRightLeft className="w-4 h-4 text-emerald-500" />
                      <span>Items Transferred to Your Account</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      <span>Recently Modified Files</span>
                    </div>
                  )}

                  {/* Sort Controls */}
                  <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
                    <span className="text-zinc-400 text-[11px] hidden sm:inline">Sort:</span>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as SortOption)}
                      className="px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 cursor-pointer"
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="size-desc">Size (Large to Small)</option>
                      <option value="size-asc">Size (Small to Large)</option>
                    </select>
                  </div>
                </div>

                {/* Empty State */}
                {displayItems.length === 0 ? (
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-400">
                      <FolderOpen className="w-7 h-7" />
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {searchQuery ? `No files matching "${searchQuery}"` : 'This folder is empty'}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                      {searchQuery
                        ? 'Try searching with a different term or clear the filter.'
                        : 'Upload files or create subfolders to start organizing your personal storage.'}
                    </p>

                    {!searchQuery && (
                      <div className="flex items-center gap-2.5 mt-6">
                        <button
                          onClick={() => {
                            setUploadModalTab('upload');
                            setUploadModalOpen(true);
                          }}
                          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-medium rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                        </button>
                        <button
                          onClick={() => {
                            setUploadModalTab('folder');
                            setUploadModalOpen(true);
                          }}
                          className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <FolderPlus className="w-3.5 h-3.5" />
                          <span>New Folder</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : viewMode === 'grid' ? (
                  /* Grid View */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayItems.map((item) => (
                      <FileCard
                        key={item.id}
                        item={item}
                        onOpen={handleOpenFolder}
                        onPreview={(i) => {
                          setSelectedItemForPreview(i);
                          setPreviewModalOpen(true);
                        }}
                        onDownload={handleDownloadItem}
                        onTransfer={handleTransferClick}
                        onRename={(i) => {
                          setSelectedItemForRename(i);
                          setRenameModalOpen(true);
                        }}
                        onDelete={(i) => {
                          setSelectedItemForDelete(i);
                          setDeleteModalOpen(true);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <FileList
                    items={displayItems}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                    onOpen={handleOpenFolder}
                    onPreview={(i) => {
                      setSelectedItemForPreview(i);
                      setPreviewModalOpen(true);
                    }}
                    onDownload={handleDownloadItem}
                    onTransfer={handleTransferClick}
                    onRename={(i) => {
                      setSelectedItemForRename(i);
                      setRenameModalOpen(true);
                    }}
                    onDelete={(i) => {
                      setSelectedItemForDelete(i);
                      setDeleteModalOpen(true);
                    }}
                  />
                )}
              </>
            )}
          </section>
        </div>
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        defaultTab={uploadModalTab}
        currentFolderId={currentFolderId}
        onUploadFiles={handleUploadFiles}
        onCreateFolder={handleCreateFolder}
      />

      <TransferModal
        isOpen={transferModalOpen}
        onClose={() => {
          setTransferModalOpen(false);
          setSelectedItemForTransfer(null);
        }}
        item={selectedItemForTransfer}
        currentUser={currentUser}
        onTransferSuccess={handleTransferSuccess}
      />

      <FilePreviewModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setSelectedItemForPreview(null);
        }}
        item={selectedItemForPreview}
        onDownload={handleDownloadItem}
        onTransfer={(item) => {
          setPreviewModalOpen(false);
          handleTransferClick(item);
        }}
      />

      <RenameModal
        isOpen={renameModalOpen}
        onClose={() => {
          setRenameModalOpen(false);
          setSelectedItemForRename(null);
        }}
        item={selectedItemForRename}
        onRenameSubmit={handleRenameItem}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedItemForDelete(null);
        }}
        item={selectedItemForDelete}
        onConfirmDelete={handleDeleteItem}
        allFiles={files.filter((f) => f.owner_id === currentUser.id)}
      />

      <SqlAndCodeModal
        isOpen={sqlModalOpen}
        onClose={() => setSqlModalOpen(false)}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onResetDatabase={handleResetDatabase}
      />
    </div>
  );
}
