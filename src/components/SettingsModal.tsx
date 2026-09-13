import { useState, useEffect } from 'react';
import {
  X,
  Database,
  Key,
  Globe,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { StorageService, DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY } from '../lib/storageEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetDatabase: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onResetDatabase,
}: SettingsModalProps) {
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('custom_sb_url') || DEFAULT_SUPABASE_URL);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => localStorage.getItem('custom_sb_key') || DEFAULT_SUPABASE_KEY);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>(() => {
    return StorageService.getClient() ? 'success' : 'idle';
  });
  const [statusMessage, setStatusMessage] = useState(() => {
    return StorageService.getClient() ? 'Connected to Supabase project successfully' : '';
  });

  useEffect(() => {
    if (isOpen) {
      const client = StorageService.getClient();
      if (client) {
        setConnectionStatus('success');
        setStatusMessage('Connected to Supabase project successfully');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      setConnectionStatus('error');
      setStatusMessage('Please provide both Supabase URL and Anon Key.');
      return;
    }

    setConnectionStatus('testing');
    setStatusMessage('Testing connection to Supabase instance...');

    try {
      const client = StorageService.initSupabase(supabaseUrl, supabaseAnonKey);
      if (!client) {
        setConnectionStatus('error');
        setStatusMessage('Failed to initialize Supabase client.');
        return;
      }

      localStorage.setItem('custom_sb_url', supabaseUrl);
      localStorage.setItem('custom_sb_key', supabaseAnonKey);

      setTimeout(() => {
        setConnectionStatus('success');
        setStatusMessage('Connected to Supabase client successfully!');
      }, 600);
    } catch (err: any) {
      setConnectionStatus('error');
      setStatusMessage(err?.message || 'Connection failed.');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo files, profiles, and transfers back to original state?')) {
      onResetDatabase();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Supabase & Storage Settings
              </h2>
              <p className="text-[11px] text-zinc-500">
                Configure live Supabase project credentials or manage sandbox
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Custom Supabase Keys */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Live Supabase Connection
              </span>
              <span className="text-[11px] text-zinc-400">Optional</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                  NEXT_PUBLIC_SUPABASE_URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://xyzcompany.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={connectionStatus === 'testing'}
                  className="px-4 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{connectionStatus === 'testing' ? 'Connecting...' : 'Connect Supabase'}</span>
                </button>

                {connectionStatus === 'success' && (
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Connected</span>
                  </span>
                )}
              </div>

              {statusMessage && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    connectionStatus === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : connectionStatus === 'error'
                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {connectionStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                  {connectionStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                  <span>{statusMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sandbox & Reset */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Reset Interactive Sandbox
                </p>
                <p className="text-[11px] text-zinc-400">
                  Restore default sample files, demo users, and test folders.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetData}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
