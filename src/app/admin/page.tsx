'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Upload, Download, Trash2, FileSpreadsheet, AlertTriangle, FileDown } from 'lucide-react'
import { toast } from '@/lib/utils/toast'

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<'append' | 'replace'>('append')
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isAuthorized = adminToken.length > 0

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv', // .csv
      ]
      
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setUploadResult(null)
        toast.info('File selected', `Ready to upload ${selectedFile.name}`)
      } else {
        toast.error('Invalid file type', 'Please select a valid Excel (.xlsx, .xls) or CSV file')
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !adminToken) return

    setUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('mode', mode)

      const response = await fetch('/api/admin/import', {
        method: 'POST',
        headers: {
          'x-admin-token': adminToken,
        },
        body: formData,
      })

      const result = await response.json()
      setUploadResult(result)

      if (result.success) {
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        toast.success('Upload successful!', result.message)
      } else {
        toast.error('Upload failed', result.message)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setUploadResult({
        success: false,
        error: 'Upload failed',
        message: errorMessage,
      })
      toast.error('Upload failed', errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleExport = async (format: 'xlsx' | 'csv' = 'xlsx') => {
    if (!adminToken) return

    try {
      const response = await fetch(`/api/admin/export?format=${format}`, {
        headers: {
          'x-admin-token': adminToken,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `specials-export-${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success('Export successful!', `Downloaded ${format.toUpperCase()} file`)
      } else {
        const error = await response.json()
        toast.error('Export failed', error.message)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Export failed', errorMessage)
    }
  }

  const handleDownloadTemplate = async () => {
    if (!adminToken) return

    try {
      const response = await fetch('/api/admin/template', {
        headers: {
          'x-admin-token': adminToken,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `kms-specials-template.xlsx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        toast.success('Template downloaded!', 'Import template ready for use')
      } else {
        const error = await response.json()
        toast.error('Template download failed', error.message)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Template download failed', errorMessage)
    }
  }

  const handleDeleteAll = async () => {
    if (!adminToken) return

    try {
      const response = await fetch('/api/admin/delete-all', {
        method: 'POST',
        headers: {
          'x-admin-token': adminToken,
        },
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success('All data deleted', 'All specials have been permanently removed')
        setShowDeleteDialog(false)
      } else {
        toast.error('Delete failed', result.message)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Delete failed', errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Manage specials data</p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              Back to Specials
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Authentication */}
        {!isAuthorized && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Authorization Required</CardTitle>
              <CardDescription>
                Enter the admin token to access administrative functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter admin token..."
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => setAdminToken(adminToken)}
                  disabled={!adminToken.trim()}
                >
                  Authorize
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isAuthorized && (
          <div className="space-y-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import Data
                </CardTitle>
                <CardDescription>
                  Upload Excel (.xlsx, .xls) or CSV files to import specials data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Template Download */}
                <div>
                  <label className="text-sm font-medium">Import Template</label>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadTemplate}
                      className="flex items-center gap-2"
                    >
                      <FileDown className="h-4 w-4" />
                      Download Template
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Get a template file with correct column headers and sample data
                    </p>
                  </div>
                </div>
                {/* Mode Selection */}
                <div>
                  <label className="text-sm font-medium">Import Mode</label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={mode === 'append' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMode('append')}
                    >
                      Append/Update
                    </Button>
                    <Button
                      variant={mode === 'replace' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMode('replace')}
                    >
                      Replace All
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mode === 'append' 
                      ? 'Add new records and update existing ones by system number'
                      : 'Delete all existing data and replace with uploaded data'
                    }
                  </p>
                </div>

                {/* File Selection */}
                <div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                  {file && (
                    <div className="mt-2 flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="secondary">{file.size} bytes</Badge>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full sm:w-auto"
                >
                  {uploading ? 'Uploading...' : `Upload & ${mode === 'append' ? 'Update' : 'Replace'}`}
                </Button>
              </CardContent>
            </Card>

            {/* Upload Results */}
            {uploadResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {uploadResult.success ? (
                      <>✅ Upload Successful</>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Upload Failed
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {uploadResult.success ? (
                    <div className="space-y-2">
                      <p className="text-green-600">
                        {uploadResult.message}
                      </p>
                      {uploadResult.imported && (
                        <p className="text-sm text-muted-foreground">
                          Records processed: {uploadResult.imported}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-destructive">
                        {uploadResult.error}: {uploadResult.message}
                      </p>
                      
                      {uploadResult.validationErrors && (
                        <div className="mt-4">
                          <h4 className="font-medium text-sm mb-2">Validation Errors:</h4>
                          <div className="max-h-40 overflow-y-auto space-y-1">
                            {uploadResult.validationErrors.slice(0, 10).map((err: any, index: number) => (
                              <div key={index} className="text-sm bg-destructive/10 p-2 rounded">
                                <span className="font-medium">Row {err.row}:</span> {err.errors.join(', ')}
                              </div>
                            ))}
                          </div>
                          {uploadResult.validationErrors.length > 10 && (
                            <p className="text-sm text-muted-foreground mt-2">
                              ...and {uploadResult.validationErrors.length - 10} more errors
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Export Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Data
                </CardTitle>
                <CardDescription>
                  Download all specials data in Excel or CSV format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => handleExport('xlsx')}
                  >
                    Export Excel (.xlsx)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExport('csv')}
                  >
                    Export CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions that will permanently delete data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      Delete All Specials
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete
                        all specials data from the system.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowDeleteDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAll}
                      >
                        Yes, delete everything
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}