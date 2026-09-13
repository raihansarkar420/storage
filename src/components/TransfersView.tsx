import { ArrowDownLeft, ArrowUpRight, Clock, User, FileText, CheckCircle2, MessageSquare } from 'lucide-react';
import { Profile, TransferRecord } from '../types/storage';
import { formatDate } from '../lib/utils';
import FileIcon from './FileIcon';

interface TransfersViewProps {
  transfers: TransferRecord[];
  currentUser: Profile;
  filterType: 'all' | 'in' | 'out';
}

export default function TransfersView({
  transfers,
  currentUser,
  filterType,
}: TransfersViewProps) {
  const filteredTransfers = transfers.filter((t) => {
    if (filterType === 'in') return t.recipient_id === currentUser.id;
    if (filterType === 'out') return t.sender_id === currentUser.id;
    return t.recipient_id === currentUser.id || t.sender_id === currentUser.id;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {filterType === 'in' ? 'Transfers Received' : filterType === 'out' ? 'Transfers Sent' : 'All Transfer Activity'}
          </h2>
          <p className="text-xs text-zinc-500">
            Audit history of files and folders transferred between accounts
          </p>
        </div>
      </div>

      {filteredTransfers.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-400">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            No transfer records found
          </p>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            When you or other users transfer ownership of files and folders, they will be logged here.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs divide-y divide-zinc-100 dark:divide-zinc-800">
          {filteredTransfers.map((t) => {
            const isRecipient = t.recipient_id === currentUser.id;
            return (
              <div key={t.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                {/* Left: Icon & File info */}
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isRecipient
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                    }`}
                  >
                    {isRecipient ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {t.file_name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                        {t.is_folder ? 'Folder' : 'File'}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-500 flex flex-wrap items-center gap-x-2">
                      {isRecipient ? (
                        <span>
                          Received from: <strong className="text-zinc-700 dark:text-zinc-300 font-mono">{t.sender_email}</strong>
                        </span>
                      ) : (
                        <span>
                          Sent to: <strong className="text-zinc-700 dark:text-zinc-300 font-mono">{t.recipient_email}</strong>
                        </span>
                      )}
                      <span>•</span>
                      <span>{formatDate(t.transferred_at)}</span>
                    </div>

                    {t.note && (
                      <div className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-800/80 px-2 py-1 rounded-lg inline-flex items-center gap-1 border border-zinc-200/50 dark:border-zinc-700/50">
                        <MessageSquare className="w-3 h-3 text-zinc-400" />
                        <span>"{t.note}"</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Status badge */}
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 self-end sm:self-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ownership Transferred</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
