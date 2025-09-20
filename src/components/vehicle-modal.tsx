import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface VehicleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicles: string[]
  partName?: string
}

export function VehicleModal({ 
  open, 
  onOpenChange, 
  vehicles, 
  partName 
}: VehicleModalProps) {
  if (!vehicles || vehicles.length === 0) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white border-2 border-kms-primary/20 shadow-modern-lg">
        <DialogHeader className="pb-4 border-b border-kms-primary/20">
          <DialogTitle className="font-heading text-xl text-kms-secondary">
            Compatible Vehicles
          </DialogTitle>
          <DialogDescription className="text-kms-secondary/70">
            {partName && (
              <span className="font-medium">
                Vehicles compatible with: <span className="text-kms-accent">{partName}</span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh] pr-2">
          <div className="rounded-lg border border-kms-primary/20 overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-kms-primary/5 to-kms-secondary/5 border-b border-kms-primary/20">
                  <TableHead className="font-heading text-kms-secondary py-3 px-4">
                    #
                  </TableHead>
                  <TableHead className="font-heading text-kms-secondary py-3 px-4">
                    Vehicle Reference
                  </TableHead>
                  <TableHead className="font-heading text-kms-secondary py-3 px-4 text-center">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle, index) => (
                  <TableRow 
                    key={index}
                    className={`transition-colors hover:bg-kms-primary/5 border-b border-kms-primary/10 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-kms-primary/2'
                    }`}
                  >
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <span className="bg-kms-secondary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {vehicle}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-center">
                      <Badge className="bg-green-100 text-green-800 font-medium px-3 py-1">
                        Compatible
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="pt-4 border-t border-kms-primary/20 bg-kms-primary/5 rounded-b-lg -mx-6 -mb-6 px-6 pb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-kms-secondary font-medium">
              Total Compatible Vehicles:
            </span>
            <Badge className="bg-kms-secondary text-white font-bold px-3 py-1">
              {vehicles.length}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}