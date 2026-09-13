export const NEXTJS_LOGIN_PAGE = `// app/login/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Cloud, Mail, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Direct Email Sign-In / Sign-Up
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage(null);

    // Direct passwordless sign-in / registration
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({
        text: 'Signing you in to your personal cloud...',
        type: 'success',
      });
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center mb-4 shadow-sm">
            <Cloud className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Personal Cloud Storage</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Instant email sign-in & sign-up
          </p>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div
            className={\`p-3.5 rounded-xl text-sm mb-6 flex items-start gap-2.5 \${
              message.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }\`}
          >
            {message.type === 'success' && <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Email Only Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="email"
                type="email"
                required
                autoFocus
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
              />
            </div>
            <p className="mt-1.5 text-xs text-zinc-400">
              Enter your email to immediately access your dashboard.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-center gap-2 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secured with Supabase Row Level Security</span>
        </div>
      </div>
    </div>
  );
};
`;

export const NEXTJS_SUPABASE_CLIENT = `// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
`;

export const NEXTJS_SUPABASE_SERVER = `// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignored when called from Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Ignored when called from Server Component
          }
        },
      },
    }
  );
}
`;

export const NEXTJS_SERVER_ACTIONS = `// app/actions/storage.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// 1. Create Folder
export async function createFolderAction(name: string, parentId: string | null = null) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) throw new Error('Unauthorized');

  const { data, error } = await supabase.from('files').insert({
    name: name.trim(),
    type: 'folder',
    size: 0,
    storage_path: null,
    is_folder: true,
    parent_id: parentId,
    owner_id: user.id,
  }).select().single();

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
  return data;
}

// 2. Delete File or Folder (Cascading delete in database)
export async function deleteItemAction(itemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // If item is file, clean up Supabase storage
  const { data: item } = await supabase
    .from('files')
    .select('storage_path, is_folder')
    .eq('id', itemId)
    .eq('owner_id', user.id)
    .single();

  if (item?.storage_path && !item.is_folder) {
    await supabase.storage.from('user_storage').remove([item.storage_path]);
  }

  const { error } = await supabase
    .from('files')
    .delete()
    .eq('id', itemId)
    .eq('owner_id', user.id);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
  return { success: true };
}

// 3. Transfer Item Ownership to another user via registered Email
export async function transferOwnershipAction(
  itemId: string,
  recipientEmail: string,
  note: string = ''
) {
  const supabase = await createClient();
  
  // Call the Postgres RPC function 'transfer_item'
  const { data, error } = await supabase.rpc('transfer_item', {
    p_item_id: itemId,
    p_recipient_email: recipientEmail.trim().toLowerCase(),
    p_note: note.trim(),
  });

  if (error) throw new Error(error.message);
  if (!data?.success) throw new Error(data?.error || 'Transfer failed');

  revalidatePath('/dashboard');
  return data;
}
`;

export const NEXTJS_DASHBOARD_PAGE = `// app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const params = await searchParams;
  const currentFolderId = params.folder || null;

  // Fetch current user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch user's files and folders
  const { data: files } = await supabase
    .from('files')
    .select('*')
    .eq('owner_id', user.id)
    .order('is_folder', { ascending: false })
    .order('name', { ascending: true });

  // Fetch transfer logs
  const { data: transfers } = await supabase
    .from('transfers')
    .select('*')
    .or(\`sender_id.eq.\${user.id},recipient_id.eq.\${user.id}\`)
    .order('transferred_at', { ascending: false });

  return (
    <DashboardClient
      user={{ id: user.id, email: user.email || '' }}
      profile={profile}
      initialFiles={files || []}
      currentFolderId={currentFolderId}
      transfers={transfers || []}
    />
  );
}
`;

export const ENV_LOCAL_TEMPLATE = `# .env.local
# Supabase Configuration (Configured for your project)
NEXT_PUBLIC_SUPABASE_URL=https://omtsiozmzjkfdruaulgf.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_XP_RjeJS-oh5v3xP96xE3A_jfqGCqUO
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_XP_RjeJS-oh5v3xP96xE3A_jfqGCqUO

# Optional: Service Role key for backend maintenance scripts (never expose to client)
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
`;

export const VERCEL_DEPLOYMENT_GUIDE = `# Deployment Guide: Next.js + Supabase on Vercel

### Step 1: Set up Supabase
1. Create a free Supabase project at https://supabase.com.
2. Go to **SQL Editor** in your Supabase project dashboard.
3. Paste and run the provided **Supabase SQL Migration Script**. This will:
   - Create the \`profiles\`, \`files\`, and \`transfers\` tables.
   - Configure the \`user_storage\` bucket and RLS policies.
   - Install the recursive ownership transfer function (\`transfer_item\`).
   - Set up the \`on_auth_user_created\` trigger for passwordless email sign-ins.
4. In Supabase Dashboard -> **Authentication** -> **URL Configuration**:
   - Add \`http://localhost:3000\` and your Vercel production URL (\`https://your-app.vercel.app\`) to **Redirect URLs**.

### Step 2: Configure Environment Variables
1. Copy \`.env.local\` to your project.
2. Fill in:
   - \`NEXT_PUBLIC_SUPABASE_URL\`
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`

### Step 3: Deploy to Vercel
1. Push your repository to GitHub / GitLab / Bitbucket.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Under **Environment Variables**, add:
   - \`NEXT_PUBLIC_SUPABASE_URL\` = your Supabase URL
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` = your Supabase Anon Key
5. Click **Deploy**. Vercel will automatically build and publish your app!
`;
