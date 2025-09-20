import { NextRequest, NextResponse } from 'next/server'
import { specialRepository } from '@/lib/db'
import { validateAdminToken } from '@/lib/utils/index'

export async function POST(request: NextRequest) {
  try {
    // Validate admin token
    const authHeader = request.headers.get('x-admin-token')
    if (!validateAdminToken(authHeader || '')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete all specials
    await specialRepository.deleteAll()

    return NextResponse.json({
      success: true,
      message: 'All specials deleted successfully',
    })
    
  } catch (error) {
    console.error('Delete all error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Delete operation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}