import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Special, CreateSpecialInput, UpdateSpecialInput, SpecialQueryParams, PaginatedResult } from '@/types'
import { SpecialRepository } from './repository'

const DATA_FILE = path.join(process.cwd(), 'data', 'specials.json')

export class JSONRepository implements SpecialRepository {
  private async ensureDataDir(): Promise<void> {
    const dataDir = path.dirname(DATA_FILE)
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }
  }

  private async readData(): Promise<Special[]> {
    await this.ensureDataDir()
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8')
      return JSON.parse(data) as Special[]
    } catch {
      // File doesn't exist or is invalid, return empty array
      await this.writeData([])
      return []
    }
  }

  private async writeData(specials: Special[]): Promise<void> {
    await this.ensureDataDir()
    await fs.writeFile(DATA_FILE, JSON.stringify(specials, null, 2))
  }

  private filterSpecials(specials: Special[], params?: SpecialQueryParams): Special[] {
    let filtered = specials

    // Global search
    if (params?.q) {
      const query = params.q.toLowerCase()
      filtered = filtered.filter(special => {
        return (
          special.part_description?.toLowerCase().includes(query) ||
          special.system_number?.toLowerCase().includes(query) ||
          special.factory_number?.toLowerCase().includes(query) ||
          special.part_name?.toLowerCase().includes(query) ||
          special.vehicle_reference?.some(ref => ref.toLowerCase().includes(query)) ||
          special.alter_numbers?.some(num => num.toLowerCase().includes(query))
        )
      })
    }

    // Apply filters
    if (params?.filters) {
      const { fr_rr, lh_rh, inr_otr, packaging, condition } = params.filters
      
      if (fr_rr && fr_rr.length > 0) {
        filtered = filtered.filter(special => fr_rr.includes(special.fr_rr))
      }
      if (lh_rh && lh_rh.length > 0) {
        filtered = filtered.filter(special => lh_rh.includes(special.lh_rh))
      }
      if (inr_otr && inr_otr.length > 0) {
        filtered = filtered.filter(special => inr_otr.includes(special.inr_otr))
      }
      if (packaging && packaging.length > 0) {
        filtered = filtered.filter(special => packaging.includes(special.packaging))
      }
      if (condition && condition.length > 0) {
        filtered = filtered.filter(special => condition.includes(special.condition))
      }
    }

    return filtered
  }

  private sortSpecials(specials: Special[], sortBy?: keyof Special, sortOrder?: 'asc' | 'desc'): Special[] {
    if (!sortBy) return specials

    return [...specials].sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]

      // Handle arrays by joining them for comparison
      if (Array.isArray(aVal)) aVal = aVal.join(', ') as any
      if (Array.isArray(bVal)) bVal = bVal.join(', ') as any

      // Handle different types
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.localeCompare(bVal)
        return sortOrder === 'desc' ? -comparison : comparison
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        const comparison = aVal - bVal
        return sortOrder === 'desc' ? -comparison : comparison
      }

      // Fallback to string comparison
      const comparison = String(aVal).localeCompare(String(bVal))
      return sortOrder === 'desc' ? -comparison : comparison
    })
  }

  async getAll(params?: SpecialQueryParams): Promise<PaginatedResult<Special>> {
    const allSpecials = await this.readData()
    let filtered = this.filterSpecials(allSpecials, params)
    
    // Sort
    filtered = this.sortSpecials(filtered, params?.sortBy, params?.sortOrder)

    // Pagination
    const page = params?.page || 1
    const limit = params?.limit || 50
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const data = filtered.slice(startIndex, endIndex)

    return {
      data,
      totalCount: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    }
  }

  async getById(id: string): Promise<Special | null> {
    const specials = await this.readData()
    return specials.find(special => special.id === id) || null
  }

  async create(input: CreateSpecialInput): Promise<Special> {
    const specials = await this.readData()
    const now = Date.now()
    const special: Special = {
      ...input,
      id: uuidv4(),
      created_at: now,
      updated_at: now,
    }
    specials.push(special)
    await this.writeData(specials)
    return special
  }

  async update(input: UpdateSpecialInput): Promise<Special> {
    const specials = await this.readData()
    const index = specials.findIndex(special => special.id === input.id)
    
    if (index === -1) {
      throw new Error(`Special with id ${input.id} not found`)
    }

    const { id, ...updates } = input
    const updatedSpecial: Special = {
      ...specials[index],
      ...updates,
      updated_at: Date.now(),
    }

    specials[index] = updatedSpecial
    await this.writeData(specials)
    return updatedSpecial
  }

  async delete(id: string): Promise<boolean> {
    const specials = await this.readData()
    const initialLength = specials.length
    const filtered = specials.filter(special => special.id !== id)
    
    if (filtered.length === initialLength) {
      return false
    }

    await this.writeData(filtered)
    return true
  }

  async deleteAll(): Promise<void> {
    await this.writeData([])
  }

  async bulkCreate(inputs: CreateSpecialInput[]): Promise<Special[]> {
    const specials = await this.readData()
    const now = Date.now()
    
    const newSpecials: Special[] = inputs.map(input => ({
      ...input,
      id: uuidv4(),
      created_at: now,
      updated_at: now,
    }))

    specials.push(...newSpecials)
    await this.writeData(specials)
    return newSpecials
  }

  async bulkUpsert(inputs: CreateSpecialInput[]): Promise<Special[]> {
    const specials = await this.readData()
    const now = Date.now()
    const results: Special[] = []

    for (const input of inputs) {
      // Try to find existing by system_number (primary identifier)
      const existingIndex = specials.findIndex(s => s.system_number === input.system_number)
      
      if (existingIndex >= 0) {
        // Update existing
        const updated: Special = {
          ...specials[existingIndex],
          ...input,
          updated_at: now,
        }
        specials[existingIndex] = updated
        results.push(updated)
      } else {
        // Create new
        const newSpecial: Special = {
          ...input,
          id: uuidv4(),
          created_at: now,
          updated_at: now,
        }
        specials.push(newSpecial)
        results.push(newSpecial)
      }
    }

    await this.writeData(specials)
    return results
  }
}