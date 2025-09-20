import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'demo'

// Template data with correct structure and sample entries
const templateData = [
  {
    system_number: 'KMS001',
    part_name: 'Front Brake Disc',
    part_description: 'High-performance ventilated brake disc for Hyundai models',
    factory_number: 'HY-BD-001',
    vehicle_reference: 'Hyundai Elantra 2020-2023, Hyundai i30 2019-2023',
    alter_numbers: 'ALT001, ALT002',
    quantity_available: 25,
    selling_price: 1250.00,
    wholesale_price: 950.00,
    condition: 'NEW',
    packaging: 'EACH',
    fr_rr: 'FRONT',
    lh_rh: 'BOTH',
    inr_otr: 'UNKNOWN',
    img: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    system_number: 'KMS002',
    part_name: 'Rear Shock Absorber',
    part_description: 'OEM replacement shock absorber for Kia Sportage',
    factory_number: 'KIA-SA-102',
    vehicle_reference: 'Kia Sportage 2018-2022, Kia Sorento 2019-2021',
    alter_numbers: 'KIA102, SA102',
    quantity_available: 12,
    selling_price: 850.00,
    wholesale_price: 650.00,
    condition: 'NEW',
    packaging: 'EACH',
    fr_rr: 'REAR',
    lh_rh: 'LEFT',
    inr_otr: 'UNKNOWN',
    img: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    // Check admin token
    const token = request.headers.get('x-admin-token')
    if (token !== ADMIN_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid admin token' },
        { status: 401 }
      )
    }

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    
    // Convert data to worksheet format
    const worksheetData = templateData.map(item => ({
      'System Number': item.system_number,
      'Part Name': item.part_name,
      'Description': item.part_description,
      'Factory Number': item.factory_number,
      'Vehicle Reference': item.vehicle_reference,
      'Alternative Numbers': item.alter_numbers,
      'Quantity Available': item.quantity_available,
      'Selling Price': item.selling_price,
      'Wholesale Price': item.wholesale_price,
      'Condition': item.condition,
      'Packaging': item.packaging,
      'Front/Rear': item.fr_rr,
      'Left/Right': item.lh_rh,
      'Inner/Outer': item.inr_otr,
      'Image URL': item.img,
      'Created At': item.created_at,
      'Updated At': item.updated_at
    }))

    const worksheet = XLSX.utils.json_to_sheet(worksheetData)

    // Set column widths for better readability
    worksheet['!cols'] = [
      { wch: 15 }, // System Number
      { wch: 30 }, // Part Name
      { wch: 40 }, // Description
      { wch: 20 }, // Factory Number
      { wch: 35 }, // Vehicle Reference
      { wch: 25 }, // Alternative Numbers
      { wch: 12 }, // Quantity Available
      { wch: 15 }, // Selling Price
      { wch: 15 }, // Wholesale Price
      { wch: 12 }, // Condition
      { wch: 12 }, // Packaging
      { wch: 12 }, // Front/Rear
      { wch: 12 }, // Left/Right
      { wch: 12 }, // Inner/Outer
      { wch: 20 }, // Image URL
      { wch: 20 }, // Created At
      { wch: 20 }, // Updated At
    ]

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KMS Specials Template')

    // Create instruction sheet
    const instructionData = [
      ['Korean Motor Spares - Import Template Instructions', '', '', ''],
      ['', '', '', ''],
      ['Field Descriptions:', '', '', ''],
      ['System Number', 'Unique identifier for each part (required)', '', ''],
      ['Part Name', 'Name/title of the part (required)', '', ''],
      ['Description', 'Detailed description of the part (optional)', '', ''],
      ['Factory Number', 'Manufacturer part number (optional)', '', ''],
      ['Vehicle Reference', 'Comma-separated list of compatible vehicles', '', ''],
      ['Alternative Numbers', 'Comma-separated list of alternative part numbers', '', ''],
      ['Quantity Available', 'Number of items in stock (required, must be >= 0)', '', ''],
      ['Selling Price', 'Retail price in ZAR (required, must be >= 0)', '', ''],
      ['Wholesale Price', 'Wholesale price in ZAR (required, must be >= 0)', '', ''],
      ['Condition', 'NEW, USED, REFURB, OPEN_BOX, or UNKNOWN (required)', '', ''],
      ['Packaging', 'EACH, SET, or KIT (required)', '', ''],
      ['Front/Rear', 'FRONT, REAR, or UNKNOWN (optional)', '', ''],
      ['Left/Right', 'LEFT, RIGHT, BOTH, or UNKNOWN (optional)', '', ''],
      ['Inner/Outer', 'INNR, OUTR, BOTH, or UNKNOWN (optional)', '', ''],
      ['Image URL', 'URL to part image (optional)', '', ''],
      ['Created At', 'ISO date string (auto-generated if empty)', '', ''],
      ['Updated At', 'ISO date string (auto-generated if empty)', '', ''],
      ['', '', '', ''],
      ['Notes:', '', '', ''],
      ['- Remove these instruction rows before importing', '', '', ''],
      ['- Sample data is provided in the template', '', '', ''],
      ['- System Number must be unique for each part', '', '', ''],
      ['- Use comma separation for multiple values in lists', '', '', ''],
      ['- All prices should be in South African Rand (ZAR)', '', '', ''],
    ]

    const instructionSheet = XLSX.utils.aoa_to_sheet(instructionData)
    instructionSheet['!cols'] = [
      { wch: 25 },
      { wch: 50 },
      { wch: 15 },
      { wch: 15 }
    ]

    XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions')

    // Generate Excel file
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="kms-specials-template.xlsx"',
      },
    })
  } catch (error) {
    console.error('Template generation error:', error)
    return NextResponse.json(
      { 
        error: 'Template generation failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}