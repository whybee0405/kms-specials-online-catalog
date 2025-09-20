import { Special } from '@/types'
import { formatZAR } from '@/lib/utils/index'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

interface SpecialCardProps {
  special: Special
}

export function SpecialCard({ special }: SpecialCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <Card className="w-full card-modern bg-white/80 backdrop-blur-sm border-2 border-kms-primary/20 hover:border-kms-primary/40 transition-all duration-300">
      <CardHeader className="pb-4 bg-gradient-to-r from-kms-primary/5 to-kms-secondary/5 rounded-t-xl border-b border-kms-primary/20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-heading text-kms-secondary leading-tight mb-2">
              {special.part_name}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className="font-mono text-sm bg-kms-primary text-kms-secondary font-bold px-3 py-1">
                {special.system_number}
              </Badge>
              {special.factory_number && (
                <Badge variant="outline" className="font-mono text-xs border-kms-secondary/30 text-kms-secondary">
                  {special.factory_number}
                </Badge>
              )}
            </div>
          </div>
          {/* Quantity status indicator */}
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
              (special.quantity_available || 0) > 5 ? 'bg-green-500 text-white' :
              (special.quantity_available || 0) > 0 ? 'bg-yellow-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {special.quantity_available || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">in stock</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 p-6">
        {/* Enhanced Price and status section */}
        <div className="flex justify-between items-center bg-gradient-to-r from-kms-accent/5 to-transparent p-4 rounded-lg border border-kms-accent/20">
          <div>
            <div className="text-2xl font-heading text-kms-accent mb-1">
              {formatZAR(special.selling_price)}
            </div>
            <p className="text-xs text-kms-accent/70 font-medium mb-1">
              Retail Price (excl VAT)
            </p>
            <p className="text-sm text-kms-secondary font-medium">
              Wholesale: {formatZAR(special.wholesale_price)} <span className="text-xs text-kms-secondary/70">(excl VAT)</span>
            </p>
          </div>
          <div className="text-right space-y-2">
            <Badge className={`px-3 py-1 font-medium shadow-lg ${
              special.condition === 'NEW' ? 'bg-green-500 text-white' :
              special.condition === 'USED' ? 'bg-yellow-500 text-white' :
              special.condition === 'REFURB' ? 'bg-blue-500 text-white' :
              special.condition === 'OPEN_BOX' ? 'bg-purple-500 text-white' :
              'bg-gray-500 text-white'
            }`}>
              {special.condition}
            </Badge>
            <div>
              <Badge className="bg-kms-secondary text-white px-3 py-1 font-medium">
                {special.packaging}
              </Badge>
            </div>
          </div>
        </div>

        {/* Vehicle compatibility section */}
        {special.vehicle_reference && special.vehicle_reference.length > 0 && (
          <div className="bg-kms-secondary/5 p-4 rounded-lg border border-kms-secondary/20">
            <div className="font-heading text-kms-secondary mb-2 text-sm">Compatible Vehicles:</div>
            <div className="flex flex-wrap gap-2">
              {special.vehicle_reference.slice(0, 4).map((ref, index) => (
                <Badge key={index} className="bg-kms-secondary text-white text-xs font-medium px-2 py-1">
                  {ref}
                </Badge>
              ))}
              {special.vehicle_reference.length > 4 && (
                <Badge className="bg-kms-accent text-white text-xs font-medium px-2 py-1">
                  +{special.vehicle_reference.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Expandable details */}
        <div>
          <Button
            variant="outline"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full justify-between border-2 border-kms-primary/30 text-kms-secondary hover:bg-kms-primary hover:text-kms-secondary font-medium py-3"
          >
            <span className="font-heading">
              {showDetails ? 'Hide Details' : 'View Full Details'}
            </span>
            {showDetails ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
          
          {showDetails && (
            <div className="mt-4 space-y-4 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-kms-primary/20">
              {special.part_description && (
                <div>
                  <div className="font-heading text-kms-secondary mb-1">Description</div>
                  <div className="text-gray-700 text-sm leading-relaxed">
                    {special.part_description}
                  </div>
                </div>
              )}

              {special.alter_numbers && special.alter_numbers.length > 0 && (
                <div>
                  <div className="font-heading text-kms-secondary mb-2">Alternative Part Numbers</div>
                  <div className="flex flex-wrap gap-1">
                    {special.alter_numbers.map((num, index) => (
                      <Badge key={index} variant="outline" className="text-xs font-mono border-kms-primary/30">
                        {num}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Position indicators */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-kms-primary/10 rounded-lg">
                  <div className="font-heading text-kms-secondary text-xs mb-1">Front/Rear</div>
                  <Badge className="bg-kms-primary/20 text-kms-secondary border-kms-primary font-medium">
                    {special.fr_rr || 'N/A'}
                  </Badge>
                </div>
                <div className="text-center p-3 bg-kms-secondary/10 rounded-lg">
                  <div className="font-heading text-kms-secondary text-xs mb-1">Left/Right</div>
                  <Badge className="bg-kms-secondary/20 text-kms-secondary border-kms-secondary font-medium">
                    {special.lh_rh || 'N/A'}
                  </Badge>
                </div>
                <div className="text-center p-3 bg-kms-accent/10 rounded-lg">
                  <div className="font-heading text-kms-secondary text-xs mb-1">Inner/Outer</div>
                  <Badge className="bg-kms-accent/20 text-kms-accent border-kms-accent font-medium">
                    {special.inr_otr || 'N/A'}
                  </Badge>
                </div>
              </div>

              {/* Enhanced Image section */}
              {special.img && !imageError && (
                <div>
                  <div className="font-heading text-kms-secondary mb-3">Part Image</div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="relative block w-full group">
                        <Image
                          src={special.img}
                          alt={special.part_name}
                          width={200}
                          height={150}
                          className="w-full h-40 object-cover rounded-lg border-2 border-kms-primary/20 cursor-pointer group-hover:border-kms-primary/40 transition-all duration-300 shadow-modern"
                          onError={() => setImageError(true)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 bg-white/90 px-3 py-1 rounded-md text-sm font-medium text-kms-secondary transition-opacity duration-300">
                            Click to enlarge
                          </div>
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl border-2 border-kms-primary/20">
                      <div className="p-2">
                        <h3 className="font-heading text-kms-secondary text-lg mb-3">{special.part_name}</h3>
                        <Image
                          src={special.img}
                          alt={special.part_name}
                          width={800}
                          height={600}
                          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                          onError={() => setImageError(true)}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* Part timestamps */}
              <div className="flex justify-between text-xs text-muted-foreground pt-3 border-t border-kms-primary/20">
                <span>Created: {new Date(special.created_at).toLocaleDateString()}</span>
                {special.updated_at && (
                  <span>Updated: {new Date(special.updated_at).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}