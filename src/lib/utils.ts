import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface UploadProgress {
  [key: string]: number;
}

export const uploadProgress: UploadProgress = {};



export function guessMedia(link: string): string | boolean {
  const extension = link.match(/\.([^.]+)$/)?.[1]?.toLowerCase();

  if (extension) {
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return "img";
    }

    if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return "vid";
    }

    if (['mp3', 'wav', 'ogg'].includes(extension)) {
      return "audio";
    }
  }

  return false;
}