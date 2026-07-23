import type { ShipmentStatus } from '../types'
import { Badge } from './ui'

const statusMeta: Record<
  ShipmentStatus,
  { label: string; tone: 'slate' | 'teal' | 'amber' | 'blue' | 'rose' | 'green' }
> = {
  draft: { label: 'Draft', tone: 'slate' },
  confirmed: { label: 'Confirmed', tone: 'blue' },
  in_production: { label: 'In production', tone: 'amber' },
  ready_to_ship: { label: 'Ready to ship', tone: 'teal' },
  shipped: { label: 'Shipped', tone: 'green' },
  delivered: { label: 'Delivered', tone: 'green' },
  cancelled: { label: 'Cancelled', tone: 'rose' },
}

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  const meta = statusMeta[status]
  return <Badge tone={meta.tone}>{meta.label}</Badge>
}

export const statusOptions: { value: ShipmentStatus; label: string }[] = Object.entries(statusMeta).map(
  ([value, meta]) => ({ value: value as ShipmentStatus, label: meta.label }),
)
