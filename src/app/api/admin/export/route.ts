import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { specialRepository } from '@/lib/db'
import { validateAdminToken, specialToCSVRow } from '@/lib/utils/index'

export async function GET(request: NextRequest) {
  try {
    // Validate admin token
    const authHeader = request.headers.get('x-admin-token')
    if (!validateAdminToken(authHeader || '')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get format from query params (default to xlsx)
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'xlsx'

    // Get all specials
    const result = await specialRepository.getAll({ limit: 10000 }) // Large limit to get all
    
    if (result.data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data to export' },
        { status: 404 }
      )
    }

    // Convert to CSV format
    const csvData = result.data.map(specialToCSVRow)

    if (format === 'json') {
      // Return JSON format
      return NextResponse.json({
        success: true,
        data: result.data,
        count: result.data.length,
      })
    }

    // Create workbook
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(csvData)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Specials')

    // Generate file buffer
    const buffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: format === 'csv' ? 'csv' : 'xlsx' 
    })

    // Set appropriate headers
    const filename = `specials-export-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}`
    const mimeType = format === 'csv' 
      ? 'text/csv' 
      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
    
  } catch (error) {
    console.error('Export error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Export failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}