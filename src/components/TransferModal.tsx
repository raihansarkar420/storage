import { useState, type FormEvent } from 'react';
import {
  X,
  ArrowRightLeft,
  Mail,
  UserCheck,
  AlertCircle,
  Folder,
  FileText,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { FileItem, Profile } from '../types/storage';
import { StorageService } from '../lib/storageEngine';
import { formatBytes } from '../lib/utils';
import FileIcon from './FileIcon';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FileItem | null;
  currentUser: Profile;
  onTransferSuccess: (result: { message: string; recipientEmail: string }) => void;
}

export default function TransferModal({
  isOpen,
  onClose,
  item,
  currentUser,
  onTransferSuccess,
}: TransferModalProps) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const registeredProfiles = StorageService.getProfiles().filter(
    (p) => p.email.toLowerCase() !== currentUser.email.toLowerCase()
  );

  const handleTransfer = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recipientEmail.trim()) {
      setError('Please enter a recipient email address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = StorageService.transferItem(
        item.id,
        recipientEmail,
        note,
        currentUser
      );

      setIsSubmitting(false);

      if (!result.success) {
        setError(result.error || 'Failed to transfer item.');
      } else {
        onTransferSuccess({
          message: `Successfully transferred "${item.name}" to ${result.recipient?.email}`,
          recipientEmail: result.recipient?.email || recipientEmail,
        });
        onClose();
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Transfer Ownership
              </h2>
              <p className="text-[11px] text-zinc-500">
                Reassign item to another registered user
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

        {/* Form Body */}
        <form onSubmit={handleTransfer} className="p-6 space-y-4">
          {/* Target Item Card */}
          <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200/50 dark:border-zinc-700">
              <FileIcon type={item.type} name={item.name} isFolder={item.is_folder} className="w-4 h-4" />
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {item.name}
              </p>
              <p className="text-[11px] text-zinc-400">
                {item.is_folder ? 'Folder (includes all nested contents)' : formatBytes(item.size)}
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Recipient Email Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Recipient Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="colleague@example.com"
                value={recipientEmail}
                onChange={(e) => {
                  setRecipientEmail(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-zinc-900 dark:text-zinc-100"
              />
            </div>

            {/* Quick Pick Registered Users */}
            {registeredProfiles.length > 0 && (
              <div className="mt-2">
                <p className="text-[11px] text-zinc-400 mb-1 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Available registered accounts:</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {registeredProfiles.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setRecipientEmail(p.email);
                        setError(null);
                      }}
                      className="text-[11px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-md border border-zinc-200/50 dark:border-zinc-700 transition-colors"
                    >
                      {p.email}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Transfer Note (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Here is the contract draft for your review."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Warning / Rules */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Once transferred, ownership is instantly reassigned. The item will appear in the recipient's root dashboard and be removed from your active storage.
            </p>
          </div>

          {/* Actions */}
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
              disabled={isSubmitting || !recipientEmail.trim()}
              className="px-5 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowRightLeft className="w-3.5 h-3.5" />
              )}
              <span>Confirm Transfer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
