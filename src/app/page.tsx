'use client'

import { useState, useEffect, useCallback } from 'react'
import { Special, SpecialFilters, PaginatedResult } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SpecialCard } from '@/components/special-card'
import { SpecialsTable } from '@/components/specials-table'
import { FilterSheet } from '@/components/filter-sheet'
import { debounce } from '@/lib/utils/index'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMediaQuery } from '@/hooks/use-media-query'

export default function HomePage() {
  const [specials, setSpecials] = useState<Special[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SpecialFilters>({})
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalCount: 0,
    totalPages: 0,
  })

  const fetchSpecials = useCallback(async (
    page: number = 1, 
    query: string = '', 
    currentFilters: SpecialFilters = {}
  ) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(query && { q: query }),
        ...(Object.keys(currentFilters).length > 0 && {
          filters: JSON.stringify(currentFilters),
        }),
      })

      const response = await fetch(`/api/specials?${params}`)
      const data = await response.json()

      if (data.success) {
        setSpecials(data.data)
        setPagination({
          page: data.pagination.page,
          limit: data.pagination.limit,
          totalCount: data.pagination.totalCount,
          totalPages: data.pagination.totalPages,
        })
      } else {
        console.error('Failed to fetch specials:', data.error)
        setSpecials([])
      }
    } catch (error) {
      console.error('Error fetching specials:', error)
      setSpecials([])
    } finally {
      setLoading(false)
    }
  }, [pagination.limit])

  const isMobile = useMediaQuery('(max-width: 640px)')

  // Initial load
  useEffect(() => {
    fetchSpecials()
  }, [fetchSpecials])

  // Handle search input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSpecials(1, searchQuery, filters)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [searchQuery, filters, fetchSpecials])

  const handleFiltersChange = (newFilters: SpecialFilters) => {
    setFilters(newFilters)
    fetchSpecials(1, searchQuery, newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
    fetchSpecials(1, searchQuery, {})
  }

  const hasActiveFilters = Object.values(filters).some(
    (filterValues) => filterValues && filterValues.length > 0
  )

  const handlePageChange = (newPage: number) => {
    fetchSpecials(newPage, searchQuery, filters)
  }

  return (
    <div className="min-h-screen kms-gradient-subtle">
      {/* Modern Header with Gradient */}
      <header className="kms-gradient-primary border-b border-white/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm p-2">
                <img 
                  src="/kms_logo.png" 
                  alt="KMS Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-heading text-white">Korean Motor Spares</h1>
                <p className="text-white/80 font-medium">Premium Auto Parts Specials</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Special Terms Disclaimer */}
        <div className="mb-8">
          <div className="card-modern p-6 bg-gradient-to-r from-kms-accent/10 to-kms-secondary/10 backdrop-blur-sm border-2 border-kms-accent/30">
            <div className="flex items-start space-x-4">
              <div className="h-6 w-6 bg-kms-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-kms-secondary text-lg font-bold mb-2">
                  Important Special Offer Terms
                </h3>
                <div className="space-y-2 text-kms-secondary/80">
                  <p className="flex items-start">
                    <span className="text-kms-accent font-bold mr-2">•</span>
                    <span>Parts on specials <strong>cannot be further discounted</strong> and are offered at the best available price.</span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-kms-accent font-bold mr-2">•</span>
                    <span>Specials are <strong>applicable to select branches only</strong>. Please contact your preferred branch first to confirm availability and applicable pricing.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters Section */}
        <div className="mb-8">
          <div className="card-modern p-6 bg-white/70 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-kms-secondary mb-2">
                  Search Parts
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-kms-secondary/60" />
                  <Input
                    placeholder="Search by part name, number, vehicle model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-lg border-2 border-kms-secondary/20 focus:border-kms-primary rounded-xl"
                  />
                </div>
              </div>
              <div className="flex items-end gap-3">
                <FilterSheet
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Results Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-kms-primary/20">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-kms-primary rounded-full"></div>
              <span className="font-medium text-kms-secondary">
                {loading ? (
                  <span className="animate-pulse">Searching inventory...</span>
                ) : (
                  <>
                    <span className="text-kms-accent font-bold">{specials.length}</span> of{' '}
                    <span className="text-kms-accent font-bold">{pagination.totalCount}</span> premium specials
                  </>
                )}
              </span>
            </div>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClearFilters}
                className="text-kms-accent hover:bg-kms-accent/10"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </div>

        {/* Content with Modern Styling */}
        {isMobile ? (
          // Mobile: Enhanced Card view
          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-56 bg-gradient-to-r from-kms-primary/10 to-kms-secondary/10 rounded-xl animate-pulse border border-kms-primary/20" />
              ))
            ) : specials.length > 0 ? (
              specials.map((special) => (
                <SpecialCard key={special.id} special={special} />
              ))
            ) : (
              <div className="text-center py-16">
                <div className="card-modern p-8 bg-white/70 backdrop-blur-sm max-w-md mx-auto">
                  <div className="h-16 w-16 bg-kms-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-kms-secondary" />
                  </div>
                  <h3 className="text-xl font-heading text-kms-secondary mb-2">No specials found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                  {hasActiveFilters && (
                    <Button 
                      onClick={handleClearFilters}
                      className="btn-kms-primary"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Desktop: Enhanced Table view
          <div className="card-modern overflow-hidden bg-white/80 backdrop-blur-sm">
            <SpecialsTable data={specials} loading={loading} />
          </div>
        )}

        {/* Enhanced Mobile Pagination */}
        {isMobile && pagination.totalPages > 1 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-kms-primary/20 p-4 shadow-modern-lg">
            <div className="flex items-center justify-between max-w-sm mx-auto">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
                className="border-2 border-kms-secondary text-kms-secondary hover:bg-kms-secondary hover:text-white"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Previous
              </Button>
              <div className="px-4 py-2 bg-kms-primary/10 rounded-lg">
                <span className="text-sm font-bold text-kms-secondary">
                  {pagination.page} of {pagination.totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="border-2 border-kms-secondary text-kms-secondary hover:bg-kms-secondary hover:text-white"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Mobile spacing for fixed pagination */}
        {isMobile && pagination.totalPages > 1 && (
          <div className="h-24" />
        )}
      </main>
    </div>
  )
}