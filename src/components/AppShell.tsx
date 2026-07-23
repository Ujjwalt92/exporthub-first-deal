import { NavLink, Outlet } from 'react-router-dom'
import {
  BookOpen,
  Building2,
  ClipboardCheck,
  Factory,
  FileSpreadsheet,
  FileText,
  HelpCircle,
  Landmark,
  LayoutDashboard,
  Mail,
  Map,
  PackageCheck,
  Scale,
  ScrollText,
  Ship,
  Truck,
  Warehouse,
} from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { computeCostSummary, dealProgress, stageLabel } from '../lib/costing'
import { Badge } from './ui'
import { WelcomeGate } from './WelcomeGate'

const groups: { title: string; items: { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }[] }[] =
  [
    {
      title: 'Start',
      items: [
        { to: '/', label: 'Deal Cockpit', icon: LayoutDashboard, end: true },
        { to: '/start-here', label: 'Start Here', icon: BookOpen },
        { to: '/beginner', label: 'Absolute Beginner', icon: HelpCircle },
        { to: '/company', label: 'Company Setup', icon: Building2 },
        { to: '/report', label: 'Completion Report', icon: FileSpreadsheet },
        { to: '/lesson', label: 'Today’s Lesson', icon: BookOpen },
        { to: '/help', label: 'Help / Glossary', icon: HelpCircle },
      ],
    },
    {
      title: 'Quote & Order',
      items: [
        { to: '/rules', label: 'Playbook Rules', icon: Scale },
        { to: '/clarify', label: 'Buyer Clarify', icon: HelpCircle },
        { to: '/cost-sheet', label: 'Cost Sheet', icon: ClipboardCheck },
        { to: '/proforma', label: 'Proforma Invoice', icon: FileText },
        { to: '/po-lc', label: 'PO / LC Review', icon: ScrollText },
        { to: '/vendor', label: 'Vendor Confirm', icon: Warehouse },
      ],
    },
    {
      title: 'Execute & Get Paid',
      items: [
        { to: '/production', label: 'Production', icon: Factory },
        { to: '/dispatch', label: 'Dispatch', icon: Truck },
        { to: '/customs', label: 'Customs', icon: PackageCheck },
        { to: '/vessel', label: 'Vessel / B/L', icon: Ship },
        { to: '/payment', label: 'Payment', icon: Landmark },
      ],
    },
    {
      title: 'Deep training (gap-fill)',
      items: [
        { to: '/fob-math', label: '₹ → USD FOB Math', icon: ClipboardCheck },
        { to: '/sample-lc', label: 'Sample LC Lab', icon: ScrollText },
        { to: '/quality', label: 'Teja Quality Specs', icon: PackageCheck },
        { to: '/cha-checklist', label: 'CHA / SB Packet', icon: FileSpreadsheet },
        { to: '/bank-docs', label: 'Bank Docs Matcher', icon: Landmark },
        { to: '/post-shipment', label: 'Post-shipment', icon: BookOpen },
      ],
    },
    {
      title: 'Docs & Comms',
      items: [
        { to: '/documents', label: 'Document Map', icon: Map },
        { to: '/documents/commercial-invoice', label: 'Commercial Invoice', icon: FileSpreadsheet },
        { to: '/documents/packing-list', label: 'Packing List', icon: FileText },
        { to: '/templates', label: 'Email Templates', icon: Mail },
      ],
    },
  ]

export function AppShell() {
  const { deal } = useStore()
  const summary = computeCostSummary(deal)
  const progress = dealProgress(deal)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <WelcomeGate />
      <div className="no-print flex min-h-screen">
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-200 px-5 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">ExportHub</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">First Deal Playbook</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">
              Built for new & existing spice traders
            </div>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                <span>Deal progress</span>
                <span>{progress.pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-teal-600" style={{ width: `${progress.pct}%` }} />
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-5 px-3 py-4">
            {groups.map((group) => (
              <div key={group.title}>
                <div className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                          isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-600 hover:bg-slate-50'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="space-y-2 border-t border-slate-200 p-4 text-xs">
            <div className="font-medium text-slate-700">{deal.company.legalName || deal.companyName}</div>
            <div className="text-slate-500">{stageLabel(deal.stage)}</div>
            <Badge tone={summary.canSendFinalPrice ? 'green' : 'amber'}>
              {summary.canSendFinalPrice ? 'Quote unlocked' : 'Rule 1: no final price yet'}
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
                <Badge tone="slate">{progress.doneCount}/{progress.total} milestones</Badge>
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto border-t border-slate-100 px-2 py-2 lg:hidden">
              {groups.flatMap((g) => g.items).map((item) => (
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
