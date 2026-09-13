# Personal Cloud Storage (Next.js + Supabase)

A clean, minimalist, and responsive Personal Cloud Storage Web Application built with **Next.js (App Router)**, **Tailwind CSS**, **Lucide React**, and **Supabase** (PostgreSQL Database, Supabase Storage, and Supabase Auth with direct email-based sign-in/sign-up).

---

## 🚀 Key Features

### 1. Instant Email Authentication (No OTP / Magic Link Required)
- Simple, 1-step sign-in and sign-up with email only.
- Instant access to the dashboard without waiting for 6-digit OTP codes or clicking email magic links.
- Automated profile creation and account setup on authentication via PostgreSQL trigger.

### 2. Modern Dashboard & Storage Management
- Minimalist Google Drive / Dropbox aesthetic with high-contrast typography, generous padding, and responsive grid/list views.
- **Breadcrumb Navigation**: Seamless traversal across nested folder hierarchies.
- **Multi-Format Uploads**: Support for images, PDFs, text, code, audio, video, and archives directly to the Supabase `user_storage` bucket.
- **Cascaded Deletions**: Deleting a folder automatically cleans up and cascades deletion to all child files and subfolders.
- **File Previews & Direct Downloads**: In-browser inspector for images, PDF reader view, and code/markdown syntax preview.
- **Real-Time Search & Category Filters**: Search by file name or filter by Images, Documents, Media, and Code.

### 3. Internal File & Folder Transfer (Key Feature)
- **Ownership Transfer**: Reassign files or entire folder trees to any registered user by entering their email address.
- **Validation**: Verifies recipient existence in the system before executing transfer.
- **Instant Reassignment**: Updates `owner_id` so the item appears immediately in the recipient's root dashboard and is removed from the sender's active storage.
- **Audit Logs**: Built-in transfer activity history tracking sender, recipient, timestamp, and optional transfer note.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS, Lucide React icons.
- **Backend**: Supabase (PostgreSQL, Row Level Security, RPC Functions, Triggers).
- **Storage**: Supabase Storage (`user_storage` bucket).
- **Auth**: Supabase Auth (Email OTP / Magic Link).
- **Deployment**: Vercel.

---

## 📦 Project Structure

```
├── app/
│   ├── actions/
│   │   └── storage.ts           # Server Actions (createFolder, deleteItem, transferOwnership)
│   ├── dashboard/
│   │   ├── page.tsx             # Server Component for Dashboard
│   │   └── DashboardClient.tsx  # Interactive Client UI
│   ├── login/
│   │   └── page.tsx             # Passwordless Email OTP Login
│   ├── layout.tsx
│   └── page.tsx                 # Root Redirect
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser Supabase client (@supabase/ssr)
│   │   └── server.ts            # Server-side Supabase client with cookies
│   └── utils.ts                 # File formatting and helper utilities
├── supabase_schema.sql          # Complete Supabase SQL migration script
├── .env.local                   # Environment variables template
└── README.md
```

---

## 🗄️ Database Schema & RLS Setup

Run the provided `supabase_schema.sql` in your **Supabase Dashboard -> SQL Editor**:

1. **`profiles` table**: Links to `auth.users(id)` and syncs via the `on_auth_user_created` trigger.
2. **`files` table**: Stores file metadata, `storage_path`, `is_folder`, `parent_id`, and `owner_id`.
3. **`transfers` table**: Audit log for sent and received file transfers.
4. **`transfer_item` RPC function**: Handles recursive ownership reassignment for files and nested folder trees.
5. **Storage Bucket & Policies**: Configures the `user_storage` bucket with secure upload and download policies.

---

## ⚡ Step-by-Step Installation & Vercel Deployment

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd personal-cloud-storage
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file at the root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://omtsiozmzjkfdruaulgf.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_XP_RjeJS-oh5v3xP96xE3A_jfqGCqUO
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_XP_RjeJS-oh5v3xP96xE3A_jfqGCqUO
```

### 3. Run Locally
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Deploy to Vercel
1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`) to **Environment Variables**.
5. Click **Deploy**.
