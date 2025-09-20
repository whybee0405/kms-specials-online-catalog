import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj)
}

export function formatDateRelative(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInDays = Math.ceil((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 0) {
    return `Expired ${Math.abs(diffInDays)} ${Math.abs(diffInDays) === 1 ? 'day' : 'days'} ago`
  } else if (diffInDays === 0) {
    return 'Expires today'
  } else if (diffInDays === 1) {
    return 'Expires tomorrow'
  } else if (diffInDays <= 7) {
    return `Expires in ${diffInDays} days`
  } else {
    return formatDate(dateObj)
  }
}

export function calculateSavings(regularPrice: number, specialPrice: number): number {
  return Math.max(0, regularPrice - specialPrice)
}

export function calculateDiscountPercentage(regularPrice: number, specialPrice: number): number {
  if (regularPrice <= 0) return 0
  const savings = calculateSavings(regularPrice, specialPrice)
  return Math.round((savings / regularPrice) * 100)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime())
}

export function getUniqueValues<T>(array: T[], key: keyof T): T[keyof T][] {
  const seen = new Set<T[keyof T]>()
  const result: T[keyof T][] = []
  
  for (const item of array) {
    const value = item[key]
    if (!seen.has(value)) {
      seen.add(value)
      result.push(value)
    }
  }
  
  return result
}