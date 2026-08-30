import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string | null | undefined): string {
  if (!url) return "https://picsum.photos/seed/default/300/400";
  if (url.startsWith('http') || url.startsWith('data:')) return url;

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://api.namhang0159.io.vn/api/v1').replace('/api/v1', '');
  return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
}
