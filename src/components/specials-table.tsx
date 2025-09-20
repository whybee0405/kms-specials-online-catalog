import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table'
import { Special } from '@/types'
import { formatZAR } from '@/lib/utils/index'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowUpDown, ChevronDown } from 'lucide-react'

interface SpecialsTableProps {
  data: Special[]
  loading?: boolean
}

export function SpecialsTable({ data, loading }: SpecialsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const columns = useMemo<ColumnDef<Special>[]>(
    () => [
      {
        accessorKey: 'system_number',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-heading text-kms-secondary hover:text-kms-primary"
          >
            System #
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-mono text-sm font-semibold text-kms-secondary bg-kms-primary/10 px-2 py-1 rounded-md w-fit">
            {row.getValue('system_number')}
          </div>
        ),
      },
      {
        accessorKey: 'part_name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-heading text-kms-secondary hover:text-kms-primary"
          >
            Part Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-semibold max-w-[300px] truncate text-gray-900">
            {row.getValue('part_name')}
          </div>
        ),
      },
      {
        accessorKey: 'factory_number',
        header: () => (
          <span className="font-heading text-kms-secondary">Factory #</span>
        ),
        cell: ({ row }) => {
          const factoryNumber = row.getValue('factory_number')
          return (
            <div className="font-mono text-sm text-kms-secondary/80">
              {factoryNumber || '-'}
            </div>
          )
        },
      },
      {
        accessorKey: 'vehicle_reference',
        header: () => (
          <span className="font-heading text-kms-secondary">Compatible Vehicles</span>
        ),
        cell: ({ row }) => {
          const refs = row.getValue('vehicle_reference') as string[]
          return (
            <div className="max-w-[220px]">
              {refs && refs.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {refs.slice(0, 2).map((ref, index) => (
                    <Badge key={index} className="text-xs bg-kms-secondary text-white font-medium px-2 py-1">
                      {ref}
                    </Badge>
                  ))}
                  {refs.length > 2 && (
                    <Badge className="text-xs bg-kms-accent text-white font-medium px-2 py-1">
                      +{refs.length - 2} more
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: 'quantity_available',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-heading text-kms-secondary hover:text-kms-primary"
          >
            Stock
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const qty = row.getValue('quantity_available') as number || 0
          return (
            <div className="text-center">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                qty > 5 ? 'bg-green-100 text-green-800' :
                qty > 0 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {qty}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: 'selling_price',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-heading text-kms-accent hover:text-kms-primary"
          >
            Retail Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const price = row.getValue('selling_price') as number
          return (
            <div className="text-right font-bold text-kms-accent text-lg">
              {formatZAR(price)}
            </div>
          )
        },
      },
      {
        accessorKey: 'wholesale_price',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-heading text-kms-secondary hover:text-kms-primary"
          >
            Wholesale
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const price = row.getValue('wholesale_price') as number
          return (
            <div className="text-right text-kms-secondary/80 font-medium">
              {formatZAR(price)}
            </div>
          )
        },
      },
      {
        accessorKey: 'condition',
        header: () => (
          <span className="font-heading text-kms-secondary">Condition</span>
        ),
        cell: ({ row }) => {
          const condition = row.getValue('condition') as string
          const colorMap = {
            NEW: 'bg-green-500 text-white shadow-green-200',
            USED: 'bg-yellow-500 text-white shadow-yellow-200',
            REFURB: 'bg-blue-500 text-white shadow-blue-200',
            OPEN_BOX: 'bg-purple-500 text-white shadow-purple-200',
            UNKNOWN: 'bg-gray-500 text-white shadow-gray-200',
          }
          return (
            <Badge 
              className={`${colorMap[condition as keyof typeof colorMap] || colorMap.UNKNOWN} font-medium px-3 py-1 shadow-lg`}
            >
              {condition}
            </Badge>
          )
        },
      },
      {
        accessorKey: 'packaging',
        header: () => (
          <span className="font-heading text-kms-secondary">Package</span>
        ),
        cell: ({ row }) => (
          <Badge className="bg-kms-primary/20 text-kms-secondary border-kms-primary font-medium">
            {row.getValue('packaging')}
          </Badge>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        {/* Loading header */}
        <div className="h-10 bg-gradient-to-r from-kms-primary/20 to-kms-secondary/20 rounded-xl animate-pulse" />
        
        {/* Loading rows */}
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 bg-gradient-to-r from-kms-primary/10 to-transparent rounded-lg animate-pulse border border-kms-primary/20" />
          ))}
        </div>
        
        {/* Loading pagination */}
        <div className="flex justify-between items-center pt-4">
          <div className="h-6 w-32 bg-kms-secondary/20 rounded animate-pulse" />
          <div className="flex space-x-2">
            <div className="h-8 w-20 bg-kms-primary/20 rounded animate-pulse" />
            <div className="h-8 w-20 bg-kms-primary/20 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Column visibility toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 bg-kms-primary rounded-full"></div>
          <h3 className="font-heading text-kms-secondary text-lg">Parts Inventory</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-2 border-kms-secondary text-kms-secondary hover:bg-kms-secondary hover:text-white">
              Customize Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-kms-primary/20">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize hover:bg-kms-primary/10"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id.replace(/_/g, ' ')}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Enhanced Table with modern styling */}
      <div className="rounded-xl border-2 border-kms-primary/20 shadow-modern-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gradient-to-r from-kms-primary/5 to-kms-secondary/5 border-b-2 border-kms-primary/20 hover:from-kms-primary/10 hover:to-kms-secondary/10">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-4 font-heading text-kms-secondary">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`transition-all duration-200 hover:bg-gradient-to-r hover:from-kms-primary/5 hover:to-transparent border-b border-kms-primary/10 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-kms-primary/2'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="h-16 w-16 bg-kms-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-kms-secondary">📦</span>
                    </div>
                    <div>
                      <p className="font-heading text-kms-secondary text-lg">No parts found</p>
                      <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-kms-accent rounded-full"></div>
          <span className="text-sm text-kms-secondary font-medium">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} items selected
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-2 border-kms-secondary text-kms-secondary hover:bg-kms-secondary hover:text-white font-medium"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-2 border-kms-secondary text-kms-secondary hover:bg-kms-secondary hover:text-white font-medium"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}