import { NextResponse } from 'next/server'
import { specialRepository } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection by getting count
    const result = await specialRepository.getAll({ limit: 1 })
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        mode: process.env.DATA_MODE || 'json',
        connection: 'ok',
        recordCount: result.totalCount,
      },
      version: process.env.npm_package_version || '1.0.0',
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          mode: process.env.DATA_MODE || 'json',
          connection: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 503 }
    )
  }
}