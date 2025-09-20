import { z } from 'zod'

// Updated to match the actual database schema
export const SpecialSchema = z.object({
  id: z.string().uuid(),
  system_number: z.string().min(1),
  factory_number: z.string().nullable().optional(),
  part_name: z.string().min(1),
  part_description: z.string().nullable().optional(),
  vehicle_reference: z.array(z.string()),
  alter_numbers: z.array(z.string()),
  fr_rr: z.enum(['FRONT', 'REAR', 'UNKNOWN']),
  lh_rh: z.enum(['LEFT', 'RIGHT', 'BOTH', 'UNKNOWN']),
  inr_otr: z.enum(['INNR', 'OUTR', 'BOTH', 'UNKNOWN']),
  quantity_available: z.number().int().min(0),
  selling_price: z.number().min(0),
  wholesale_price: z.number().min(0),
  packaging: z.enum(['EACH', 'SET', 'KIT']),
  condition: z.enum(['NEW', 'USED', 'REFURB', 'OPEN_BOX', 'UNKNOWN']),
  img: z.string().nullable().optional(),
  created_at: z.number(),
  updated_at: z.number(),
})

export const CreateSpecialSchema = z.object({
  id: z.string().uuid().optional(),
  system_number: z.string().min(1, 'System number is required').transform((s) => s.trim()),
  factory_number: z.string().transform((s) => s.trim()).nullable().optional(),
  part_name: z.string().min(1, 'Part name is required').transform((s) => s.trim()),
  part_description: z.string().transform((s) => s.trim()).nullable().optional(),
  vehicle_reference: z.array(z.string()).default([]),
  alter_numbers: z.array(z.string()).default([]),
  fr_rr: z.enum(['FRONT', 'REAR', 'UNKNOWN']).default('UNKNOWN'),
  lh_rh: z.enum(['LEFT', 'RIGHT', 'BOTH', 'UNKNOWN']).default('UNKNOWN'),
  inr_otr: z.enum(['INNR', 'OUTR', 'BOTH', 'UNKNOWN']).default('UNKNOWN'),
  quantity_available: z.union([
    z.number().int().min(0),
    z.string().transform((s) => {
      const num = parseInt(s.trim(), 10)
      if (isNaN(num)) return 0
      return num
    })
  ]).default(0),
  selling_price: z.union([
    z.number().min(0),
    z.string().transform((s) => {
      const num = parseFloat(s.trim())
      if (isNaN(num)) throw new Error(`Invalid selling price: ${s}`)
      return num
    })
  ]),
  wholesale_price: z.union([
    z.number().min(0),
    z.string().transform((s) => {
      const num = parseFloat(s.trim())
      if (isNaN(num)) throw new Error(`Invalid wholesale price: ${s}`)
      return num
    })
  ]),
  packaging: z.enum(['EACH', 'SET', 'KIT']).default('EACH'),
  condition: z.enum(['NEW', 'USED', 'REFURB', 'OPEN_BOX', 'UNKNOWN']).default('NEW'),
  img: z.string().transform((s) => s.trim()).nullable().optional(),
  created_at: z.number().default(() => Date.now()),
  updated_at: z.number().default(() => Date.now()),
})

export const UpdateSpecialSchema = CreateSpecialSchema.partial().extend({
  id: z.string().uuid(),
})

export const SpecialFiltersSchema = z.object({
  fr_rr: z.array(z.string()).optional(),
  lh_rh: z.array(z.string()).optional(),
  inr_otr: z.array(z.string()).optional(),
  packaging: z.array(z.string()).optional(),
  condition: z.array(z.string()).optional(),
})

export const SpecialQuerySchema = z.object({
  q: z.string().optional(),
  page: z.string().transform((s) => parseInt(s, 10) || 1).optional(),
  limit: z.string().transform((s) => Math.min(parseInt(s, 10) || 50, 100)).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  filters: z.string().transform((s) => {
    try {
      return SpecialFiltersSchema.parse(JSON.parse(s))
    } catch {
      return {}
    }
  }).optional(),
})

export type SpecialSchemaType = z.infer<typeof SpecialSchema>
export type CreateSpecialSchemaType = z.infer<typeof CreateSpecialSchema>
export type UpdateSpecialSchemaType = z.infer<typeof UpdateSpecialSchema>