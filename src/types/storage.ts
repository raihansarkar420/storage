export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string; // mime type or 'folder' or extension like 'pdf', 'image/png'
  size: number; // in bytes
  storage_path: string | null;
  is_folder: boolean;
  parent_id: string | null;
  owner_id: string;
  owner_email?: string;
  original_owner_email?: string; // If transferred
  is_transferred?: boolean;
  transferred_at?: string;
  created_at: string;
  updated_at: string;
  content_preview?: string; // For text/code/svg/dataUrl
  download_url?: string;
}

export interface TransferRecord {
  id: string;
  file_id: string;
  file_name: string;
  is_folder: boolean;
  sender_id: string;
  sender_email: string;
  recipient_id: string;
  recipient_email: string;
  transferred_at: string;
  note?: string;
}

export interface StorageStats {
  usedBytes: number;
  totalBytes: number;
  filesCount: number;
  foldersCount: number;
  categories: {
    images: number;
    documents: number;
    media: number;
    code: number;
    others: number;
  };
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc' | 'size-desc' | 'size-asc';
export type FilterType = 'all' | 'folders' | 'images' | 'documents' | 'media' | 'code';
export type StorageTab = 'my-files' | 'transferred-in' | 'transferred-out' | 'recent';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
