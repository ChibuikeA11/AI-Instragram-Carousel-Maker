'use server';

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Only keeping the cn utility since it's used by both server and client components
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
