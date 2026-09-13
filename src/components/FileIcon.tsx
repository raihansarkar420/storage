import {
  Folder,
  FileText,
  Image as ImageIcon,
  FileCode,
  Music,
  Video,
  Archive,
  File,
} from 'lucide-react';
import { getFileTypeCategory } from '../lib/utils';

interface FileIconProps {
  type: string;
  name: string;
  isFolder: boolean;
  className?: string;
}

export default function FileIcon({ type, name, isFolder, className = 'w-5 h-5' }: FileIconProps) {
  if (isFolder) {
    return <Folder className={`${className} text-amber-500 fill-amber-500/20`} />;
  }

  const category = getFileTypeCategory(type, name);

  switch (category) {
    case 'image':
      return <ImageIcon className={`${className} text-sky-500`} />;
    case 'pdf':
      return <FileText className={`${className} text-rose-500`} />;
    case 'document':
      return <FileText className={`${className} text-blue-500`} />;
    case 'code':
      return <FileCode className={`${className} text-emerald-500`} />;
    case 'audio':
      return <Music className={`${className} text-purple-500`} />;
    case 'video':
      return <Video className={`${className} text-indigo-500`} />;
    case 'archive':
      return <Archive className={`${className} text-orange-500`} />;
    default:
      return <File className={`${className} text-zinc-400`} />;
  }
}
