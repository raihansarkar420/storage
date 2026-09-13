import { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Code2,
  Database,
  FileCode,
  Layers,
  Terminal,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { SUPABASE_SQL_MIGRATION } from '../lib/sqlScripts';
import {
  NEXTJS_LOGIN_PAGE,
  NEXTJS_DASHBOARD_PAGE,
  NEXTJS_SUPABASE_CLIENT,
  NEXTJS_SUPABASE_SERVER,
  NEXTJS_SERVER_ACTIONS,
  ENV_LOCAL_TEMPLATE,
  VERCEL_DEPLOYMENT_GUIDE,
} from '../lib/nextjsExportCode';

interface SqlAndCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'sql' | 'login' | 'dashboard' | 'supabase-client' | 'supabase-server' | 'actions' | 'env' | 'vercel-guide';

export default function SqlAndCodeModal({ isOpen, onClose }: SqlAndCodeModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('sql');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string; file: string; icon: any }[] = [
    { id: 'sql', label: 'Supabase SQL Schema', file: 'supabase_migration.sql', icon: Database },
    { id: 'login', label: 'Login (Email Auth)', file: 'app/login/page.tsx', icon: FileCode },
    { id: 'dashboard', label: 'Dashboard Page', file: 'app/dashboard/page.tsx', icon: FileCode },
    { id: 'supabase-client', label: 'Supabase Client', file: 'lib/supabase/client.ts', icon: Code2 },
    { id: 'supabase-server', label: 'Supabase Server', file: 'lib/supabase/server.ts', icon: Code2 },
    { id: 'actions', label: 'Server Actions', file: 'app/actions/storage.ts', icon: Terminal },
    { id: 'env', label: '.env.local', file: '.env.local', icon: Layers },
    { id: 'vercel-guide', label: 'Vercel Deploy Guide', file: 'DEPLOYMENT.md', icon: BookOpen },
  ];

  const getContent = () => {
    switch (activeTab) {
      case 'sql':
        return SUPABASE_SQL_MIGRATION;
      case 'login':
        return NEXTJS_LOGIN_PAGE;
      case 'dashboard':
        return NEXTJS_DASHBOARD_PAGE;
      case 'supabase-client':
        return NEXTJS_SUPABASE_CLIENT;
      case 'supabase-server':
        return NEXTJS_SUPABASE_SERVER;
      case 'actions':
        return NEXTJS_SERVER_ACTIONS;
      case 'env':
        return ENV_LOCAL_TEMPLATE;
      case 'vercel-guide':
        return VERCEL_DEPLOYMENT_GUIDE;
      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-5xl h-[85vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Supabase SQL Schema & Next.js Deliverables
              </h2>
              <p className="text-[11px] text-zinc-500">
                Complete production scripts, RLS policies, Next.js App Router code & Vercel deployment instructions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Current File'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto shrink-0 text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors font-medium ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs border border-zinc-200/80 dark:border-zinc-700'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-zinc-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content Box */}
        <div className="flex-1 bg-zinc-950 p-4 overflow-auto font-mono text-xs text-zinc-200 leading-relaxed selection:bg-zinc-800">
          <pre className="whitespace-pre">{getContent()}</pre>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-2.5 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between shrink-0">
          <span>
            Target file: <strong className="font-mono text-zinc-700 dark:text-zinc-300">{tabs.find((t) => t.id === activeTab)?.file}</strong>
          </span>
          <span className="text-zinc-400">
            Copy and paste into your local Next.js project or Supabase SQL Editor
          </span>
        </div>
      </div>
    </div>
  );
}
