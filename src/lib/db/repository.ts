import { Special, CreateSpecialInput, UpdateSpecialInput, SpecialQueryParams, PaginatedResult } from '@/types'

export interface SpecialRepository {
  getAll(params?: SpecialQueryParams): Promise<PaginatedResult<Special>>
  getById(id: string): Promise<Special | null>
  create(input: CreateSpecialInput): Promise<Special>
  update(input: UpdateSpecialInput): Promise<Special>
  delete(id: string): Promise<boolean>
  deleteAll(): Promise<void>
  bulkCreate(inputs: CreateSpecialInput[]): Promise<Special[]>
  bulkUpsert(inputs: CreateSpecialInput[]): Promise<Special[]>
}