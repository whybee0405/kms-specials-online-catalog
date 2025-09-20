import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { specialRepository } from '@/lib/db'
import { CreateSpecialSchema } from '@/lib/validations/special'
import { validateAdminToken, csvRowToSpecialInput } from '@/lib/utils/index'
import { CreateSpecialInput } from '@/types'

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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const mode = formData.get('mode') as string // 'append' or 'replace'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Parse Excel/CSV file
    let workbook: XLSX.WorkBook
    try {
      workbook = XLSX.read(buffer, { type: 'buffer' })
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format' },
        { status: 400 }
      )
    }

    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rawData = XLSX.utils.sheet_to_json(sheet)

    if (rawData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'File is empty' },
        { status: 400 }
      )
    }

    // Process and validate data
    const processedData: CreateSpecialInput[] = []
    const errors: Array<{ row: number; errors: string[] }> = []

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i]
      const rowNumber = i + 2 // Excel rows are 1-indexed, plus header row

      try {
        // Convert raw row to special input format
        const specialInput = csvRowToSpecialInput(row)
        
        // Validate with Zod schema
        const validatedInput = CreateSpecialSchema.parse(specialInput)
        processedData.push(validatedInput)
      } catch (error) {
        let errorMessage = 'Validation failed'
        if (error instanceof Error) {
          errorMessage = error.message
        }
        
        errors.push({
          row: rowNumber,
          errors: [errorMessage],
        })
      }
    }

    // If there are validation errors, return them for preview
    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Validation errors found',
        validationErrors: errors,
        validRows: processedData.length,
        totalRows: rawData.length,
      })
    }

    // Process import based on mode
    let result: any[] = []
    
    if (mode === 'replace') {
      // Delete all existing data first
      await specialRepository.deleteAll()
      result = await specialRepository.bulkCreate(processedData)
    } else {
      // Append/update mode (upsert)
      result = await specialRepository.bulkUpsert(processedData)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${result.length} specials`,
      imported: result.length,
      mode,
    })
    
  } catch (error) {
    console.error('Import error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Import failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}