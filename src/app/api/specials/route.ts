import { NextRequest, NextResponse } from 'next/server'
import { specialRepository } from '@/lib/db'
import { SpecialQuerySchema } from '@/lib/validations/special'
import { SpecialQueryParams } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const queryParams = {
      q: searchParams.get('q') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '50',
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
      filters: searchParams.get('filters') || undefined,
    }

    // Validate query parameters
    const validatedParams = SpecialQuerySchema.parse(queryParams)
    
    // Build repository query params
    const repositoryParams: SpecialQueryParams = {
      q: validatedParams.q,
      page: validatedParams.page || 1,
      limit: validatedParams.limit || 50,
      sortBy: validatedParams.sortBy as any,
      sortOrder: validatedParams.sortOrder,
      filters: validatedParams.filters,
    }

    // Get specials from repository
    const result = await specialRepository.getAll(repositoryParams)

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching specials:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch specials',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}