import { useState } from 'react';
import {
  Cloud,
  Search,
  LayoutGrid,
  List,
  Code2,
  Settings,
  LogOut,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  Database,
  ArrowLeftRight,
} from 'lucide-react';
import { Profile, ViewMode } from '../types/storage';
import { DEMO_USERS } from '../lib/storageEngine';

interface NavbarProps {
  currentUser: Profile;
  onSwitchUser: (user: Profile) => void;
  onLogout: () => void;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSqlModal: () => void;
  onOpenSettingsModal: () => void;
  isSupabaseConnected: boolean;
}

export default function Navbar({
  currentUser,
  onSwitchUser,
  onLogout,
  viewMode,
  onToggleViewMode,
  searchQuery,
  onSearchChange,
  onOpenSqlModal,
  onOpenSettingsModal,
  isSupabaseConnected,
}: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shadow-xs">
            <Cloud className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Personal Cloud Storage
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Supabase Backend</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-lg mx-2 sm:mx-6">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search files, folders, documents..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-100/80 dark:bg-zinc-800/80 hover:bg-zinc-100 border border-transparent focus:border-zinc-300 dark:focus:border-zinc-700 rounded-xl focus:outline-none focus:bg-white dark:focus:bg-zinc-900 transition-all placeholder:text-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Actions & Profile Menu */}
        <div className="flex items-center gap-2">
          {/* View Toggle (Grid / List) */}
          <div className="hidden md:flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
            <button
              onClick={() => onToggleViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs font-medium'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleViewMode('list')}
              title="List View"
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs font-medium'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Supabase SQL & Next.js Code Export */}
          <button
            onClick={onOpenSqlModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors"
            title="View Supabase SQL migration script and Next.js Codebase"
          >
            <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">SQL & Next.js</span>
          </button>

          {/* Settings / Supabase Status */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors relative"
            title="Database & Storage Settings"
          >
            <Settings className="w-4 h-4" />
            {isSupabaseConnected && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900"></span>
            )}
          </button>

          {/* User Account / Fast Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-zinc-200 ring-1 ring-zinc-300 dark:ring-zinc-700 shrink-0">
                {currentUser.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.email}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-semibold text-xs text-zinc-700">
                    {currentUser.email[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="hidden lg:block text-left leading-tight max-w-[130px] truncate">
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {currentUser.full_name || currentUser.email.split('@')[0]}
                </div>
                <div className="text-[11px] text-zinc-500 truncate">{currentUser.email}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Signed in as</p>
                    <p className="text-xs text-zinc-500 truncate font-mono">{currentUser.email}</p>
                  </div>

                  {/* Switch Account (For testing multi-user file transfer) */}
                  <div className="py-1">
                    <div className="px-3 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>Test Multi-User Transfer</span>
                    </div>
                    {DEMO_USERS.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSwitchUser(user);
                          setShowUserMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors ${
                          user.id === currentUser.id
                            ? 'bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={user.avatar_url}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-5 h-5 rounded-full object-cover shrink-0"
                          />
                          <span className="truncate">{user.email}</span>
                        </div>
                        {user.id === currentUser.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1 pt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
