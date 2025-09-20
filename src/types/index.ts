export type Special = {
  id: string // UUID primary key
  vehicle_reference: string[] // comma-delimited string in DB, array in API
  system_number: string // SKU
  factory_number: string | null
  alter_numbers: string[] // comma-delimited string in DB, array in API
  part_name: string
  part_description: string | null
  fr_rr: 'FRONT' | 'REAR' | 'UNKNOWN'
  lh_rh: 'LEFT' | 'RIGHT' | 'BOTH' | 'UNKNOWN' 
  inr_otr: 'INNR' | 'OUTR' | 'BOTH' | 'UNKNOWN'
  quantity_available: number
  img: string | null // URL or relative path
  selling_price: number
  wholesale_price: number
  packaging: 'EACH' | 'SET' | 'KIT'
  condition: 'NEW' | 'USED' | 'REFURB' | 'OPEN_BOX' | 'UNKNOWN'
  created_at: number // unix timestamp ms
  updated_at: number // unix timestamp ms
}

export type CreateSpecialInput = Omit<Special, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateSpecialInput = Partial<CreateSpecialInput> & { id: string }

export type SpecialFilters = {
  fr_rr?: string[]
  lh_rh?: string[]
  inr_otr?: string[]
  packaging?: string[]
  condition?: string[]
}

export type SpecialQueryParams = {
  q?: string
  page?: number
  limit?: number
  sortBy?: keyof Special
  sortOrder?: 'asc' | 'desc'
  filters?: SpecialFilters
}

export type PaginatedResult<T> = {
  data: T[]
  totalCount: number
  page: number
  limit: number
  totalPages: number
}