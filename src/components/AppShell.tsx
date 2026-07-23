import { NavLink, Outlet } from 'react-router-dom'
import {
  BookOpen,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Map,
  Scale,
  ScrollText,
  Warehouse,
} from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { computeCostSummary, stageLabel } from '../lib/costing'
import { Badge } from './ui'

const nav = [
  { to: '/', label: 'Deal Home', icon: LayoutDashboard, end: true },
  { to: '/rules', label: 'Playbook Rules', icon: Scale },
  { to: '/clarify', label: 'Buyer Clarify', icon: HelpCircle },
  { to: '/cost-sheet', label: 'Cost Sheet', icon: ClipboardCheck },
  { to: '/proforma', label: 'Proforma Invoice', icon: FileText },
  { to: '/po-lc', label: 'PO / LC Review', icon: ScrollText },
  { to: '/vendor', label: 'Vendor Confirm', icon: Warehouse },
  { to: '/documents', label: 'Document Map', icon: Map },
  { to: '/lesson', label: 'Today’s Lesson', icon: BookOpen },
]

export function AppShell() {
  const { deal } = useStore()
  const summary = computeCostSummary(deal)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="no-print flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-200 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">ExportHub</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">First Deal Playbook</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">
              Teja S17 → Jebel Ali · Live project, not a textbook
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-2 border-t border-slate-200 p-4 text-xs">
            <div className="font-medium text-slate-700">{deal.companyName}</div>
            <div className="text-slate-500">{stageLabel(deal.stage)}</div>
            <Badge tone={summary.canSendFinalPrice ? 'green' : 'amber'}>
              {summary.canSendFinalPrice ? 'Ready to quote' : 'Do not send final price yet'}
            </Badge>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex flex-col gap-2 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FileSpreadsheet className="h-4 w-4 text-teal-700" />
                <span className="font-medium text-slate-900">{deal.productName}</span>
                <span className="hidden sm:inline">· {deal.container} · {deal.incoterm}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="blue">{deal.paymentTerms}</Badge>
                <Badge tone={deal.unitPriceUsd ? 'green' : 'rose'}>
                  {deal.unitPriceUsd ? `FOB USD ${deal.unitPriceUsd}/kg` : 'Unit price empty'}
                </Badge>
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto border-t border-slate-100 px-2 py-2 lg:hidden">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${
                      isActive ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
