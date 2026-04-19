import Link from "next/link"
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react"
import { Booking, BookingStatus } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const statusConfig: Record<BookingStatus, { label: string; variant: "success" | "warning" | "info" | "destructive" | "outline"; icon: React.ElementType }> = {
  CONFIRMED: { label: "Confirmed", variant: "success", icon: CheckCircle2 },
  PENDING: { label: "Pending", variant: "warning", icon: Loader2 },
  COMPLETED: { label: "Completed", variant: "info", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", variant: "destructive", icon: XCircle },
}

interface BookingCardProps {
  booking: Booking
  providerName?: string
  serviceName?: string
  onCancel?: (id: string) => void
  className?: string
}

export function BookingCard({ booking, providerName, serviceName, onCancel, className }: BookingCardProps) {
  const cfg = statusConfig[booking.status]
  const StatusIcon = cfg.icon

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Calendar size={22} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="font-semibold truncate">{serviceName ?? "Service"}</h4>
              <Badge variant={cfg.variant as any} className="text-[10px]">
                <StatusIcon size={10} className="mr-1" />
                {cfg.label}
              </Badge>
            </div>
            {providerName && (
              <p className="text-sm text-muted-foreground mb-2">with {providerName}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={11} /> {new Date(booking.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} /> {booking.startTime} – {booking.endTime}
              </span>
            </div>
          </div>

          {/* Price + actions */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <p className="text-xl font-black">${booking.totalPrice}</p>
            {booking.status === "PENDING" || booking.status === "CONFIRMED" ? (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/5"
                onClick={() => onCancel?.(booking.id)}
              >
                Cancel
              </Button>
            ) : (
              <Link href={`/booking/${booking.providerId}`}>
                <Button variant="outline" size="sm">Rebook</Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
