import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getFileTypeCategory(type: string, name: string): 'image' | 'pdf' | 'document' | 'code' | 'audio' | 'video' | 'archive' | 'folder' | 'other' {
  if (type === 'folder') return 'folder';
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const lowerType = type.toLowerCase();

  if (lowerType.includes('image') || ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext)) {
    return 'image';
  }
  if (lowerType.includes('pdf') || ext === 'pdf') {
    return 'pdf';
  }
  if (
    lowerType.includes('word') ||
    lowerType.includes('text/plain') ||
    lowerType.includes('document') ||
    ['doc', 'docx', 'txt', 'rtf', 'odt', 'csv', 'xlsx', 'xls'].includes(ext)
  ) {
    return 'document';
  }
  if (
    lowerType.includes('json') ||
    lowerType.includes('javascript') ||
    lowerType.includes('typescript') ||
    ['ts', 'tsx', 'js', 'jsx', 'json', 'html', 'css', 'py', 'sql', 'md', 'sh', 'yaml', 'yml'].includes(ext)
  ) {
    return 'code';
  }
  if (lowerType.includes('audio') || ['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(ext)) {
    return 'audio';
  }
  if (lowerType.includes('video') || ['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext)) {
    return 'video';
  }
  if (lowerType.includes('zip') || ['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) {
    return 'archive';
  }
  return 'other';
}
