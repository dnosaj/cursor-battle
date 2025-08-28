import { type ClassValue } from "clsx"

// Simple utility functions without external dependencies for now
export function cn(...inputs: ClassValue[]) {
  // Simple class merging utility - replace with clsx + tailwind-merge later
  return inputs.filter(Boolean).join(' ');
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
