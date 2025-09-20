import { Special } from '@/types'
import { v4 as uuidv4 } from 'uuid'

/**
 * Format a number as South African Rand (ZAR)
 */
export function formatZAR(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Convert comma-delimited string to array
 */
export function csvToArray(csv: string): string[] {
  if (!csv || csv.trim() === '') return []
  return csv.split(',').map(item => item.trim()).filter(Boolean)
}

/**
 * Convert array to comma-delimited string
 */
export function arrayToCSV(arr: string[]): string {
  return arr.filter(Boolean).join(', ')
}

/**
 * Debounce function for search inputs
 */
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

/**
 * Convert Special data to CSV export format
 */
export function specialToCSVRow(special: Special): Record<string, any> {
  return {
    id: special.id,
    system_number: special.system_number,
    factory_number: special.factory_number || '',
    part_name: special.part_name,
    part_description: special.part_description || '',
    vehicle_reference: arrayToCSV(special.vehicle_reference),
    alter_numbers: arrayToCSV(special.alter_numbers),
    fr_rr: special.fr_rr,
    lh_rh: special.lh_rh,
    inr_otr: special.inr_otr,
    quantity_available: special.quantity_available,
    selling_price: special.selling_price,
    wholesale_price: special.wholesale_price,
    packaging: special.packaging,
    condition: special.condition,
    img: special.img || '',
    created_at: special.created_at,
    updated_at: special.updated_at,
  }
}

/**
 * Convert CSV row to Special creation input
 */
export function csvRowToSpecialInput(row: any): any {
  // Handle both template format (user-friendly headers) and raw format (database field names)
  const getValue = (templateKey: string, rawKey: string) => {
    return row[templateKey] || row[rawKey] || ''
  }

  const getArrayValue = (templateKey: string, rawKey: string) => {
    const value = getValue(templateKey, rawKey)
    return csvToArray(String(value))
  }

  return {
    id: String(getValue('ID', 'id')).trim() || uuidv4(),
    system_number: String(getValue('System Number', 'system_number')).trim(),
    factory_number: String(getValue('Factory Number', 'factory_number')).trim() || null,
    part_name: String(getValue('Part Name', 'part_name')).trim(),
    part_description: String(getValue('Description', 'part_description')).trim() || null,
    vehicle_reference: getArrayValue('Vehicle Reference', 'vehicle_reference'),
    alter_numbers: getArrayValue('Alternative Numbers', 'alter_numbers'),
    fr_rr: String(getValue('Front/Rear', 'fr_rr') || 'UNKNOWN').trim().toUpperCase() as 'FRONT' | 'REAR' | 'UNKNOWN',
    lh_rh: String(getValue('Left/Right', 'lh_rh') || 'UNKNOWN').trim().toUpperCase() as 'LEFT' | 'RIGHT' | 'BOTH' | 'UNKNOWN',
    inr_otr: String(getValue('Inner/Outer', 'inr_otr') || 'UNKNOWN').trim().toUpperCase() as 'INNR' | 'OUTR' | 'BOTH' | 'UNKNOWN',
    quantity_available: parseInt(String(getValue('Quantity Available', 'quantity_available') || '0'), 10),
    selling_price: parseFloat(String(getValue('Selling Price', 'selling_price') || '0')),
    wholesale_price: parseFloat(String(getValue('Wholesale Price', 'wholesale_price') || '0')),
    packaging: String(getValue('Packaging', 'packaging') || 'EACH').trim().toUpperCase() as 'EACH' | 'SET' | 'KIT',
    condition: String(getValue('Condition', 'condition') || 'UNKNOWN').trim().toUpperCase() as 'NEW' | 'USED' | 'REFURB' | 'OPEN_BOX' | 'UNKNOWN',
    img: String(getValue('Image URL', 'img')).trim() || null,
    created_at: getValue('Created At', 'created_at') ? 
      new Date(String(getValue('Created At', 'created_at'))).getTime() : 
      Date.now(),
    updated_at: getValue('Updated At', 'updated_at') ? 
      new Date(String(getValue('Updated At', 'updated_at'))).getTime() : 
      Date.now(),
  }
}

/**
 * Validate admin token
 */
export function validateAdminToken(token: string | undefined): boolean {
  const adminToken = process.env.ADMIN_TOKEN
  if (!adminToken) {
    console.warn('ADMIN_TOKEN not set in environment variables')
    return false
  }
  return token === adminToken
}

/**
 * Get unique values from array of specials for a given field
 */
export function getUniqueValues<T extends keyof Special>(
  specials: Special[],
  field: T
): Special[T][] {
  const values = specials.map(special => special[field])
  return Array.from(new Set(values))
}

/**
 * Calculate pagination info
 */
export function calculatePagination(totalCount: number, page: number, limit: number) {
  const totalPages = Math.ceil(totalCount / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1
  
  return {
    totalPages,
    hasNextPage,
    hasPrevPage,
    startIndex: (page - 1) * limit,
    endIndex: Math.min(page * limit - 1, totalCount - 1),
  }
}