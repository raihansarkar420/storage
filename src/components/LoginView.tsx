import { useState, type FormEvent } from 'react';
import {
  Cloud,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { Profile } from '../types/storage';
import { DEMO_USERS, StorageService } from '../lib/storageEngine';

interface LoginViewProps {
  onLoginSuccess: (user: Profile) => void;
  onOpenSqlModal: () => void;
}

export default function LoginView({ onLoginSuccess, onOpenSqlModal }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = await StorageService.authenticateUser(cleanEmail);
      setIsLoading(false);
      onLoginSuccess(user);
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Authentication failed.');
    }
  };

  const handleDirectDemoLogin = async (demoUser: Profile) => {
    setIsLoading(true);
    try {
      const user = await StorageService.authenticateUser(demoUser.email);
      setIsLoading(false);
      onLoginSuccess(user);
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Demo login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* App Logo */}
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shadow-md">
            <Cloud className="w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Personal Cloud Storage
        </h2>
        <p className="mt-1 text-center text-xs text-zinc-500">
          Instant email sign in & sign up with Supabase
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-zinc-900 py-8 px-6 sm:px-10 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-6">
          {/* Error banner */}
          {error && (
            <div className="p-3 rounded-xl text-xs bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {/* Form: Email-Only Sign In / Sign Up */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
              >
                Enter Your Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 text-zinc-900 dark:text-zinc-100 transition-all"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-zinc-400">
                New emails automatically sign up. Existing accounts sign in directly.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 disabled:opacity-50 rounded-xl text-xs font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900 rounded-full animate-spin" />
              ) : (
                <>
                  <span>Continue with Email</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Instant Test Accounts (1-Click)</span>
            </div>

            <div className="space-y-1.5">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleDirectDemoLogin(user)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 text-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={user.avatar_url}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div className="text-left truncate">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 block truncate">
                        {user.full_name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono block truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-zinc-500 shrink-0">
                    Sign in →
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer schema view button */}
          <div className="pt-2 text-center">
            <button
              onClick={onOpenSqlModal}
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline decoration-zinc-300 underline-offset-4"
            >
              View Supabase SQL Schema & Next.js Source Code
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Email-based Authentication with Supabase Row Level Security</span>
        </div>
      </div>
    </div>
  );
}
