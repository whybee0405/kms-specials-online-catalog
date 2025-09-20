import { SpecialFilters } from '@/types'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Filter, X } from 'lucide-react'
import { useState } from 'react'

interface FilterSheetProps {
  filters: SpecialFilters
  onFiltersChange: (filters: SpecialFilters) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

const FILTER_OPTIONS = {
  fr_rr: ['FRONT', 'REAR', 'UNKNOWN'] as const,
  lh_rh: ['LEFT', 'RIGHT', 'BOTH', 'UNKNOWN'] as const,
  inr_otr: ['INNR', 'OUTR', 'BOTH', 'UNKNOWN'] as const,
  packaging: ['EACH', 'SET', 'KIT'] as const,
  condition: ['NEW', 'USED', 'REFURB', 'OPEN_BOX'] as const,
}

const FILTER_LABELS = {
  fr_rr: 'Front/Rear',
  lh_rh: 'Left/Right',
  inr_otr: 'Inner/Outer',
  packaging: 'Packaging',
  condition: 'Condition',
}

export function FilterSheet({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  hasActiveFilters 
}: FilterSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFilterToggle = (
    filterKey: keyof SpecialFilters,
    value: string
  ) => {
    const currentValues = (filters[filterKey] as string[]) || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]

    onFiltersChange({
      ...filters,
      [filterKey]: newValues.length > 0 ? newValues as any : undefined,
    })
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filterValues) => {
      return count + (filterValues?.length || 0)
    }, 0)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="lg"
          className="relative border-2 border-kms-primary text-kms-primary hover:bg-kms-primary hover:text-white font-medium px-6 h-12 shadow-modern"
        >
          <Filter className="h-5 w-5 mr-2" />
          <span className="font-heading">Advanced Filters</span>
          {hasActiveFilters && (
            <Badge className="ml-3 bg-kms-accent text-white px-2 py-0.5 text-xs font-bold shadow-lg">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-full sm:max-w-md border-r-2 border-kms-primary/20 bg-white/95 backdrop-blur-lg flex flex-col">
        <SheetHeader className="pb-6 border-b border-kms-primary/20 flex-shrink-0">
          <SheetTitle className="flex items-center justify-between">
            <span className="font-heading text-xl text-kms-secondary">Filter Parts</span>
            {hasActiveFilters && (
              <Button
                onClick={() => {
                  onClearFilters()
                  setIsOpen(false)
                }}
                className="btn-kms-accent text-sm px-4 py-2"
              >
                Clear All
              </Button>
            )}
          </SheetTitle>
          <p className="text-kms-secondary/70 text-sm mt-2">
            Refine your search with detailed filtering options
          </p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 pr-2">
          <div className="space-y-6">
            {Object.entries(FILTER_OPTIONS).map(([filterKey, options]) => {
              const typedFilterKey = filterKey as keyof SpecialFilters
              const activeValues = (filters[typedFilterKey] as string[]) || []

              return (
                <div key={filterKey} className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-kms-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading text-kms-secondary text-base font-bold">
                      {FILTER_LABELS[typedFilterKey]}
                    </h3>
                    {activeValues.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFiltersChange({
                          ...filters,
                          [typedFilterKey]: undefined,
                        })}
                        className="h-auto p-2 text-kms-accent hover:bg-kms-accent/10 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {options.map((option) => {
                      const isActive = activeValues.includes(option)
                      return (
                        <button
                          key={option}
                          onClick={() => handleFilterToggle(typedFilterKey, option)}
                          className="transition-all duration-200"
                        >
                          <Badge
                            className={`w-full justify-center py-2 px-3 text-sm font-medium shadow-modern hover:shadow-modern-lg transition-all duration-200 ${
                              isActive 
                                ? 'bg-kms-secondary text-white border-kms-secondary' 
                                : 'bg-white text-kms-secondary border-2 border-kms-secondary/30 hover:border-kms-secondary/60 hover:bg-kms-secondary/5'
                            }`}
                          >
                            {option}
                          </Badge>
                        </button>
                      )
                    })}
                  </div>
                  
                  {activeValues.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-kms-primary/20">
                      <p className="text-xs text-kms-secondary/70 mb-2">Selected:</p>
                      <div className="flex flex-wrap gap-1">
                        {activeValues.map((value, index) => (
                          <Badge key={index} className="bg-kms-primary text-kms-secondary text-xs px-2 py-1">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="border-t border-kms-primary/20 pt-6 pb-6 flex-shrink-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-kms-secondary font-medium">Active Filters:</span>
              <Badge className="bg-kms-primary text-kms-secondary font-bold px-3 py-1">
                {getActiveFilterCount()}
              </Badge>
            </div>
            <Button 
              onClick={() => setIsOpen(false)} 
              className="w-full btn-kms-secondary font-heading text-base py-3"
            >
              Apply Filters & View Results
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}