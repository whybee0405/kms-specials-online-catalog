#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const sampleSpecials = [
  {
    id: uuidv4(),
    systemNumber: "KMS001",
    description: "Front Brake Pads - Hyundai Elantra 2019-2023",
    partNumber: "58101-F2A00",
    category: "Brake System",
    manufacturer: "Genuine Hyundai",
    regularPrice: 85.99,
    specialPrice: 64.49,
    savings: 21.50,
    availableQuantity: 15,
    validUntil: new Date('2024-02-29').toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    systemNumber: "KMS002", 
    description: "Engine Air Filter - Kia Sorento 2016-2021",
    partNumber: "28113-C5100",
    category: "Engine",
    manufacturer: "Genuine Kia",
    regularPrice: 32.95,
    specialPrice: 24.71,
    savings: 8.24,
    availableQuantity: 8,
    validUntil: new Date('2024-03-15').toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    systemNumber: "KMS003",
    description: "Rear Shock Absorber - Genesis G70 2019-2022", 
    partNumber: "55350-G9000",
    category: "Suspension",
    manufacturer: "Genuine Genesis",
    regularPrice: 245.00,
    specialPrice: 183.75,
    savings: 61.25,
    availableQuantity: 4,
    validUntil: new Date('2024-02-28').toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    systemNumber: "KMS004",
    description: "Fuel Pump Assembly - Hyundai Tucson 2016-2021",
    partNumber: "31110-D3400",
    category: "Fuel System", 
    manufacturer: "Genuine Hyundai",
    regularPrice: 189.99,
    specialPrice: 151.99,
    savings: 38.00,
    availableQuantity: 6,
    validUntil: new Date('2024-03-31').toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    systemNumber: "KMS005",
    description: "Transmission Filter Kit - Kia Sportage 2017-2022",
    partNumber: "46321-D9000",
    category: "Transmission",
    manufacturer: "Genuine Kia", 
    regularPrice: 67.50,
    specialPrice: 47.25,
    savings: 20.25,
    availableQuantity: 12,
    validUntil: new Date('2024-02-25').toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    systemNumber: "KMS006",
    description: "Headlight Assembly LED - Genesis GV70 2022-2024",
    partNumber: "92101-CU000",
    category: "Lighting",
    manufacturer: "Genuine Genesis",
    regularPrice: 890.00,
    specialPrice: 712.00,
    savings: 178.00,
    availableQuantity: 2,
    validUntil: new Date('2024-03-30').toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    systemNumber: "KMS007",
    description: "Power Steering Pump - Hyundai Santa Fe 2013-2018",
    partNumber: "57100-2W100",
    category: "Steering",
    manufacturer: "Genuine Hyundai",
    regularPrice: 425.99,
    specialPrice: 319.49,
    savings: 106.50,
    availableQuantity: 3,
    validUntil: new Date('2024-02-20').toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    systemNumber: "KMS008",
    description: "Radiator Assembly - Kia Forte 2019-2023",
    partNumber: "25310-M6000",
    category: "Cooling System",
    manufacturer: "Genuine Kia",
    regularPrice: 295.00,
    specialPrice: 221.25,
    savings: 73.75,
    availableQuantity: 7,
    validUntil: new Date('2024-03-10').toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    systemNumber: "KMS009",
    description: "Front Strut Assembly - Genesis G90 2017-2023",
    partNumber: "54650-D2000",
    category: "Suspension",
    manufacturer: "Genuine Genesis",
    regularPrice: 520.00,
    specialPrice: 416.00,
    savings: 104.00,
    availableQuantity: 4,
    validUntil: new Date('2024-04-15').toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    systemNumber: "KMS010",
    description: "Door Lock Actuator - Hyundai Veloster 2012-2017",
    partNumber: "81320-2V000",
    category: "Body & Trim",
    manufacturer: "Genuine Hyundai", 
    regularPrice: 125.50,
    specialPrice: 87.85,
    savings: 37.65,
    availableQuantity: 9,
    validUntil: new Date('2024-02-28').toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    systemNumber: "KMS011",
    description: "Catalytic Converter - Kia Rio 2018-2023",
    partNumber: "28950-H9100",
    category: "Exhaust System",
    manufacturer: "Genuine Kia",
    regularPrice: 650.00,
    specialPrice: 487.50,
    savings: 162.50,
    availableQuantity: 3,
    validUntil: new Date('2024-03-25').toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    systemNumber: "KMS012",
    description: "Windshield Wiper Motor - Genesis G80 2021-2024",
    partNumber: "98110-T1000",
    category: "Body & Trim",
    manufacturer: "Genuine Genesis",
    regularPrice: 185.99,
    specialPrice: 139.49,
    savings: 46.50,
    availableQuantity: 5,
    validUntil: new Date('2024-04-30').toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Write sample data
const filePath = path.join(dataDir, 'specials.json')
fs.writeFileSync(filePath, JSON.stringify(sampleSpecials, null, 2))

console.log(`✅ Created sample data with ${sampleSpecials.length} specials`)
console.log(`📁 File: ${filePath}`)
console.log('🚀 Run "npm run dev" to start the development server')