import { JSONRepository } from './json-repository'
import { SpecialRepository } from './repository'

export function createSpecialRepository(): SpecialRepository {
  const dataMode = process.env.DATA_MODE || 'json'
  
  switch (dataMode) {
    case 'json':
      return new JSONRepository()
    case 'sqlite':
      // For now, fallback to JSON. SQLite implementation would go here
      // when better-sqlite3 can be properly installed on this system
      console.warn('SQLite mode requested but not available, falling back to JSON mode')
      return new JSONRepository()
    default:
      throw new Error(`Unknown DATA_MODE: ${dataMode}`)
  }
}

export const specialRepository = createSpecialRepository()