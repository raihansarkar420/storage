import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FileItem, Profile, StorageStats, TransferRecord } from '../types/storage';

// Default Demo User Accounts for realistic interactive testing
export const DEMO_USERS: Profile[] = [
  {
    id: 'usr_sarah_101',
    email: 'sarah@cloud.io',
    full_name: 'Sarah Connor',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-01-15T09:00:00Z',
  },
  {
    id: 'usr_alex_202',
    email: 'alex@design.co',
    full_name: 'Alex Rivera',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-02-10T14:30:00Z',
  },
  {
    id: 'usr_akash_303',
    email: 'akashsar4200@gmail.com',
    full_name: 'Akash Sar',
    avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    created_at: '2026-03-01T11:20:00Z',
  },
];

// Initial Seed Files for interactive testing
export const INITIAL_FILES: FileItem[] = [
  // Sarah's root folders
  {
    id: 'fld_projects',
    name: 'Client Projects',
    type: 'folder',
    size: 0,
    storage_path: null,
    is_folder: true,
    parent_id: null,
    owner_id: 'usr_sarah_101',
    owner_email: 'sarah@cloud.io',
    created_at: '2026-08-10T10:00:00Z',
    updated_at: '2026-08-10T10:00:00Z',
  },
  {
    id: 'fld_design_assets',
    name: 'Design Assets & Branding',
    type: 'folder',
    size: 0,
    storage_path: null,
    is_folder: true,
    parent_id: null,
    owner_id: 'usr_sarah_101',
    owner_email: 'sarah@cloud.io',
    created_at: '2026-08-12T14:20:00Z',
    updated_at: '2026-08-12T14:20:00Z',
  },
  // Files inside Client Projects
  {
    id: 'fil_q3_report',
    name: 'Q3_Financial_Forecast.pdf',
    type: 'application/pdf',
    size: 3450000, // 3.45 MB
    storage_path: 'usr_sarah_101/Q3_Financial_Forecast.pdf',
    is_folder: false,
    parent_id: 'fld_projects',
    owner_id: 'usr_sarah_101',
    owner_email: 'sarah@cloud.io',
    created_at: '2026-09-01T11:15:00Z',
    updated_at: '2026-09-01T11:15:00Z',
    content_preview: 'FINANCIAL REPORT 2026\n\nExecutive Summary:\nRevenue grew 32% QoQ across enterprise cloud tiers.\nCustomer retention remains steady at 98.4%.\nOperational margins projected at 41%.',
    download_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 'fil_contract_agreement',
    name: 'Master_Services_Agreement.pdf',
    type: 'application/pdf',
    size: 1820000, // 1.82 MB
    storage_path: 'usr_sarah_101/Master_Services_Agreement.pdf',
    is_folder: false,
    parent_id: 'fld_projects',
    owner_id: 'usr_sarah_101',
    owner_email: 'sarah@cloud.io',
    created_at: '2026-09-05T16:40:00Z',
    updated_at: '2026-09-05T16:40:00Z',
    content_preview: 'MASTER SERVICES AGREEMENT (MSA)\n\nThis Agreement is entered into by and between Provider and Client.\nTerms of Service, Liability, Confidentiality and Cloud Storage SLA terms.',
    download_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  // Files inside Design Assets
  {
    id: 'fil_hero_mockup',
    name: 'Product_Hero_Mockup.png',
    type: 'image/png',
    size: 4200000, // 4.2 MB
    storage_path: 'usr_sarah_101/Product_Hero_Mockup.png',
    is_folder: false,
    parent_id: 'fld_design_assets',
    owner_id: 'usr_sarah_101',
    owner_email: 'sarah@cloud.io',
    created_at: '2026-09-08T09:30:00Z',
    updated_at: '2026-09-08T09:30:00Z',
    content_preview: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    download_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'fil_brand_guidelines',
    name: 'Brand_Identity_Spec.md',
    type: 'text/markdown',
    size: 48000, // 48 KB
    storage_path: 'usr_sarah_101/Brand_Identity_Spec.md',
    is_folder: false,
    parent_id: 'fld_design_assets',
    owner_id: 'usr_sarah_101',
    owner_email: 'sarah@cloud.io',
    created_at: '2026-09-09T13:00:00Z',
    updated_at: '2026-09-09T13:00:00Z',
    content_preview: `# Brand Identity Specification 2026

## Palette
- Primary: #18181B (Zinc 900)
- Surface: #FAFAFA (Zinc 50)
- Accent: #3B82F6 (Blue 500)
- Success: #10B981 (Emerald 500)

## Typography
- Primary: Plus Jakarta Sans
- Monospace: JetBrains Mono

## Tone of Voice
- Minimalist, direct, reliable, and accessible.`,
  },
  // Sarah root files
  {
    id: 'fil_infra_config',
    name: 'infra_architecture.json',
    type: 'application/json',
    size: 15400, // 15.4 KB
    storage_path: 'usr_sarah_101/infra_architecture.json',
    is_folder: false,
    parent_id: null,
    owner_id: 'usr_sarah_101',
    owner_email: 'sarah@cloud.io',
    created_at: '2026-09-10T14:10:00Z',
    updated_at: '2026-09-10T14:10:00Z',
    content_preview: `{\n  "environment": "production",\n  "region": "us-east-1",\n  "database": "Supabase PostgreSQL",\n  "storage_bucket": "user_storage",\n  "ssl": true,\n  "replication": {\n    "enabled": true,\n    "frequency": "realtime"\n  }\n}`,
  },
  {
    id: 'fil_sarah_landscape',
    name: 'Architecture_Concept_Photo.jpg',
    type: 'image/jpeg',
    size: 3100000,
    storage_path: 'usr_sarah_101/Architecture_Concept_Photo.jpg',
    is_folder: false,
    parent_id: null,
    owner_id: 'usr_sarah_101',
    owner_email: 'sarah@cloud.io',
    created_at: '2026-09-11T15:20:00Z',
    updated_at: '2026-09-11T15:20:00Z',
    content_preview: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
    download_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
  },

  // Alex's initial files
  {
    id: 'fld_alex_mobile',
    name: 'Mobile App Wireframes',
    type: 'folder',
    size: 0,
    storage_path: null,
    is_folder: true,
    parent_id: null,
    owner_id: 'usr_alex_202',
    owner_email: 'alex@design.co',
    created_at: '2026-08-20T08:00:00Z',
    updated_at: '2026-08-20T08:00:00Z',
  },
  {
    id: 'fil_alex_icons',
    name: 'system_icon_pack.svg',
    type: 'image/svg+xml',
    size: 89000,
    storage_path: 'usr_alex_202/system_icon_pack.svg',
    is_folder: false,
    parent_id: 'fld_alex_mobile',
    owner_id: 'usr_alex_202',
    owner_email: 'alex@design.co',
    created_at: '2026-08-25T11:00:00Z',
    updated_at: '2026-08-25T11:00:00Z',
    content_preview: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  },
  {
    id: 'fil_alex_notes',
    name: 'UX_Audit_Checklist.md',
    type: 'text/markdown',
    size: 32000,
    storage_path: 'usr_alex_202/UX_Audit_Checklist.md',
    is_folder: false,
    parent_id: null,
    owner_id: 'usr_alex_202',
    owner_email: 'alex@design.co',
    created_at: '2026-09-02T10:10:00Z',
    updated_at: '2026-09-02T10:10:00Z',
    content_preview: '# UX Audit Checklist\n- [x] Passwordless OTP flow tested\n- [x] Breadcrumb tree navigation verified\n- [x] File transfer to registered email operational\n- [x] RLS policies enforced',
  }
];

// Initial Transfer Logs
export const INITIAL_TRANSFERS: TransferRecord[] = [
  {
    id: 'trf_001',
    file_id: 'fil_alex_notes',
    file_name: 'UX_Audit_Checklist.md',
    is_folder: false,
    sender_id: 'usr_alex_202',
    sender_email: 'alex@design.co',
    recipient_id: 'usr_sarah_101',
    recipient_email: 'sarah@cloud.io',
    transferred_at: '2026-09-02T10:15:00Z',
    note: 'Here is the UX checklist we finalized for the Supabase release.',
  },
];

const STORAGE_KEY_FILES = 'pcs_files_db_v2';
const STORAGE_KEY_PROFILES = 'pcs_profiles_db_v2';
const STORAGE_KEY_TRANSFERS = 'pcs_transfers_db_v2';
const STORAGE_KEY_CURRENT_USER = 'pcs_current_user_v2';
const STORAGE_KEY_CONFIG = 'pcs_supabase_config_v2';

export const DEFAULT_SUPABASE_URL =
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL ||
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  'https://omtsiozmzjkfdruaulgf.supabase.co';

export const DEFAULT_SUPABASE_KEY =
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_XP_RjeJS-oh5v3xP96xE3A_jfqGCqUO';

export class StorageService {
  private static client: SupabaseClient | null = null;

  // Initialize Supabase Client if credentials exist
  static initSupabase(url: string, key: string): SupabaseClient | null {
    if (!url || !key) {
      this.client = null;
      return null;
    }
    try {
      this.client = createClient(url, key);
      return this.client;
    } catch (e) {
      console.error('Failed to init Supabase client:', e);
      this.client = null;
      return null;
    }
  }

  static getClient(): SupabaseClient | null {
    if (!this.client) {
      const url = localStorage.getItem('custom_sb_url') || DEFAULT_SUPABASE_URL;
      const key = localStorage.getItem('custom_sb_key') || DEFAULT_SUPABASE_KEY;
      if (url && key) {
        this.initSupabase(url, key);
      }
    }
    return this.client;
  }

  // Load state from local storage or defaults
  static getFiles(): FileItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_FILES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(INITIAL_FILES));
    return INITIAL_FILES;
  }

  static saveFiles(files: FileItem[]) {
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
  }

  static getProfiles(): Profile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(DEMO_USERS));
    return DEMO_USERS;
  }

  static saveProfiles(profiles: Profile[]) {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  }

  static getTransfers(): TransferRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TRANSFERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEY_TRANSFERS, JSON.stringify(INITIAL_TRANSFERS));
    return INITIAL_TRANSFERS;
  }

  static saveTransfers(transfers: TransferRecord[]) {
    localStorage.setItem(STORAGE_KEY_TRANSFERS, JSON.stringify(transfers));
  }

  static getCurrentUser(): Profile {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    const defaultUser = DEMO_USERS[0];
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(defaultUser));
    return defaultUser;
  }

  static setCurrentUser(user: Profile) {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  }

  // Create or Sign-In user by email (Passwordless / OTP / Magic Link)
  static async authenticateUser(email: string): Promise<Profile> {
    const trimmed = email.trim().toLowerCase();
    const profiles = this.getProfiles();
    let existing = profiles.find((p) => p.email.toLowerCase() === trimmed);

    if (!existing) {
      const newProfile: Profile = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: trimmed,
        full_name: trimmed.split('@')[0],
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmed)}`,
        created_at: new Date().toISOString(),
      };
      profiles.push(newProfile);
      this.saveProfiles(profiles);
      existing = newProfile;
    }

    this.setCurrentUser(existing);
    return existing;
  }

  // Create Folder
  static createFolder(name: string, parentId: string | null, user: Profile): FileItem {
    const files = this.getFiles();
    const newFolder: FileItem = {
      id: 'fld_' + Math.random().toString(36).substring(2, 10),
      name: name.trim() || 'New Folder',
      type: 'folder',
      size: 0,
      storage_path: null,
      is_folder: true,
      parent_id: parentId,
      owner_id: user.id,
      owner_email: user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    files.push(newFolder);
    this.saveFiles(files);
    return newFolder;
  }

  // Upload File
  static uploadFile(
    file: File,
    contentPreview: string,
    parentId: string | null,
    user: Profile
  ): FileItem {
    const files = this.getFiles();
    const ext = file.name.split('.').pop() || '';
    const newFile: FileItem = {
      id: 'fil_' + Math.random().toString(36).substring(2, 10),
      name: file.name,
      type: file.type || ext || 'application/octet-stream',
      size: file.size,
      storage_path: `${user.id}/${Date.now()}_${file.name}`,
      is_folder: false,
      parent_id: parentId,
      owner_id: user.id,
      owner_email: user.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      content_preview: contentPreview,
      download_url: contentPreview.startsWith('http') || contentPreview.startsWith('data:') ? contentPreview : undefined,
    };

    files.push(newFile);
    this.saveFiles(files);
    return newFile;
  }

  // Cascading Item Deletion
  static deleteItem(itemId: string, user: Profile): { deletedCount: number; deletedNames: string[] } {
    const files = this.getFiles();
    const itemToDelete = files.find((f) => f.id === itemId && f.owner_id === user.id);
    if (!itemToDelete) return { deletedCount: 0, deletedNames: [] };

    const idsToDelete = new Set<string>();
    const namesDeleted: string[] = [];

    const collectDescendants = (id: string) => {
      idsToDelete.add(id);
      const target = files.find((f) => f.id === id);
      if (target) namesDeleted.push(target.name);

      const children = files.filter((f) => f.parent_id === id && f.owner_id === user.id);
      for (const child of children) {
        collectDescendants(child.id);
      }
    };

    collectDescendants(itemId);

    const remainingFiles = files.filter((f) => !idsToDelete.has(f.id));
    this.saveFiles(remainingFiles);

    return {
      deletedCount: idsToDelete.size,
      deletedNames: namesDeleted,
    };
  }

  // Internal Ownership Transfer with Recipient Email Validation & Recursive Subtree Transfer
  static transferItem(
    itemId: string,
    recipientEmail: string,
    note: string,
    currentUser: Profile
  ): { success: boolean; error?: string; count?: number; recipient?: Profile } {
    const trimmedEmail = recipientEmail.trim().toLowerCase();

    if (!trimmedEmail) {
      return { success: false, error: 'Recipient email is required.' };
    }

    if (trimmedEmail === currentUser.email.toLowerCase()) {
      return { success: false, error: 'You cannot transfer an item to yourself.' };
    }

    const profiles = this.getProfiles();
    const recipient = profiles.find((p) => p.email.toLowerCase() === trimmedEmail);

    if (!recipient) {
      return {
        success: false,
        error: `Recipient "${trimmedEmail}" is not registered in the system. Registered users: ${profiles.map(p => p.email).join(', ')}`,
      };
    }

    const files = this.getFiles();
    const rootItem = files.find((f) => f.id === itemId && f.owner_id === currentUser.id);

    if (!rootItem) {
      return { success: false, error: 'Item not found or you do not have ownership permission.' };
    }

    // Collect all descendant ids if rootItem is a folder
    const targetIds = new Set<string>();
    const collectDescendants = (id: string) => {
      targetIds.add(id);
      const children = files.filter((f) => f.parent_id === id && f.owner_id === currentUser.id);
      for (const child of children) {
        collectDescendants(child.id);
      }
    };

    collectDescendants(itemId);

    // Update ownership
    const updatedFiles = files.map((f) => {
      if (targetIds.has(f.id)) {
        return {
          ...f,
          owner_id: recipient.id,
          owner_email: recipient.email,
          original_owner_email: f.original_owner_email || currentUser.email,
          is_transferred: true,
          transferred_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Put the root item at recipient's root dashboard level
          parent_id: f.id === itemId ? null : f.parent_id,
        };
      }
      return f;
    });

    this.saveFiles(updatedFiles);

    // Log the transfer
    const transfers = this.getTransfers();
    const newRecord: TransferRecord = {
      id: 'trf_' + Math.random().toString(36).substring(2, 9),
      file_id: rootItem.id,
      file_name: rootItem.name,
      is_folder: rootItem.is_folder,
      sender_id: currentUser.id,
      sender_email: currentUser.email,
      recipient_id: recipient.id,
      recipient_email: recipient.email,
      transferred_at: new Date().toISOString(),
      note: note.trim() || undefined,
    };
    transfers.unshift(newRecord);
    this.saveTransfers(transfers);

    return {
      success: true,
      count: targetIds.size,
      recipient,
    };
  }

  // Rename item
  static renameItem(itemId: string, newName: string, user: Profile): boolean {
    const files = this.getFiles();
    const idx = files.findIndex((f) => f.id === itemId && f.owner_id === user.id);
    if (idx === -1 || !newName.trim()) return false;

    files[idx].name = newName.trim();
    files[idx].updated_at = new Date().toISOString();
    this.saveFiles(files);
    return true;
  }

  // Calculate user's storage quota
  static calculateStorageStats(userId: string): StorageStats {
    const files = this.getFiles().filter((f) => f.owner_id === userId);
    let usedBytes = 0;
    let filesCount = 0;
    let foldersCount = 0;

    const categories = {
      images: 0,
      documents: 0,
      media: 0,
      code: 0,
      others: 0,
    };

    for (const f of files) {
      if (f.is_folder) {
        foldersCount++;
      } else {
        filesCount++;
        usedBytes += f.size;

        const type = f.type.toLowerCase();
        const ext = f.name.split('.').pop()?.toLowerCase() || '';

        if (type.includes('image') || ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) {
          categories.images += f.size;
        } else if (
          type.includes('pdf') ||
          type.includes('word') ||
          type.includes('document') ||
          ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)
        ) {
          categories.documents += f.size;
        } else if (
          type.includes('audio') ||
          type.includes('video') ||
          ['mp3', 'mp4', 'mov', 'wav'].includes(ext)
        ) {
          categories.media += f.size;
        } else if (
          type.includes('json') ||
          type.includes('javascript') ||
          type.includes('typescript') ||
          ['ts', 'tsx', 'js', 'jsx', 'html', 'css', 'json', 'sql', 'py', 'md'].includes(ext)
        ) {
          categories.code += f.size;
        } else {
          categories.others += f.size;
        }
      }
    }

    return {
      usedBytes,
      totalBytes: 1024 * 1024 * 1024, // 1.0 GB Free Tier
      filesCount,
      foldersCount,
      categories,
    };
  }

  // Reset database to initial state
  static resetToDefault() {
    localStorage.removeItem(STORAGE_KEY_FILES);
    localStorage.removeItem(STORAGE_KEY_PROFILES);
    localStorage.removeItem(STORAGE_KEY_TRANSFERS);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    return {
      files: this.getFiles(),
      profiles: this.getProfiles(),
      transfers: this.getTransfers(),
      user: this.getCurrentUser(),
    };
  }
}
