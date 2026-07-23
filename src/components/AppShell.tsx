import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
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
  Menu,
  PackageCheck,
  Scale,
  ScrollText,
  Settings,
  Ship,
  Sparkles,
  Truck,
  Warehouse,
  X,
} from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { computeCostSummary, dealProgress, stageLabel } from '../lib/costing'
import { Badge, Button } from './ui'
import { WelcomeGate } from './WelcomeGate'

const groups: { title: string; items: { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }[] }[] =
  [
    {
      title: 'Workspace',
      items: [
        { to: '/workspace', label: 'Deal Cockpit', icon: LayoutDashboard, end: true },
        { to: '/start-here', label: 'Start Here', icon: BookOpen },
        { to: '/beginner', label: 'Beginner Guide', icon: HelpCircle },
        { to: '/company', label: 'Company Setup', icon: Building2 },
        { to: '/report', label: 'Completion Report', icon: FileSpreadsheet },
        { to: '/lesson', label: 'Today’s Lesson', icon: BookOpen },
        { to: '/settings', label: 'Settings & Backup', icon: Settings },
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
      title: 'Training Labs',
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
        { to: '/help', label: 'Help / Glossary', icon: HelpCircle },
      ],
    },
  ]

const mobilePrimary = [
  { to: '/workspace', label: 'Cockpit', icon: LayoutDashboard, end: true },
  { to: '/cost-sheet', label: 'Costing', icon: ClipboardCheck },
  { to: '/proforma', label: 'PI', icon: FileText },
  { to: '/po-lc', label: 'LC', icon: ScrollText },
  { to: '/settings', label: 'More', icon: Settings },
]

export function AppShell() {
  const { deal } = useStore()
  const summary = computeCostSummary(deal)
  const progress = dealProgress(deal)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <WelcomeGate />
      <div className="no-print flex min-h-screen">
        <aside className="hidden w-[17.5rem] shrink-0 overflow-y-auto border-r border-slate-200/90 bg-white/95 lg:flex lg:flex-col">
          <div className="border-b border-slate-200 px-5 py-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-xs font-bold text-white shadow-sm shadow-teal-900/20">
                EH
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">ExportHub</div>
                <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">First Deal OS</div>
              </div>
            </Link>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-[11px] text-slate-500">
                <span>Deal progress</span>
                <span className="font-medium text-slate-700">{progress.pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all"
                  style={{ width: `${progress.pct}%` }}
                />
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-5 px-3 py-4">
            {groups.map((group) => (
              <div key={group.title}>
                <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {group.title}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition ${
                          isActive
                            ? 'bg-teal-50 text-teal-900 shadow-sm shadow-teal-900/5'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0 opacity-80" />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="space-y-2 border-t border-slate-200 p-4 text-xs">
            <div className="font-medium text-slate-800">{deal.company.legalName || deal.companyName}</div>
            <div className="text-slate-500">{stageLabel(deal.stage)}</div>
            <Badge tone={summary.canSendFinalPrice ? 'green' : 'amber'}>
              {summary.canSendFinalPrice ? 'Quote unlocked' : 'Rule 1: no final price yet'}
            </Badge>
            <Link to="/pricing" className="mt-2 inline-flex text-[11px] font-medium text-teal-700 hover:underline">
              View pricing / sell script
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col pb-20 lg:pb-0">
          <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">{deal.productName}</div>
                  <div className="truncate text-xs text-slate-500">
                    {deal.container} · {deal.incoterm} · {deal.portOfLoading} → {deal.portOfDischarge}
                  </div>
                </div>
              </div>
              <div className="hidden flex-wrap justify-end gap-2 sm:flex">
                <Badge tone="blue">{deal.paymentTerms}</Badge>
                <Badge tone={deal.unitPriceUsd ? 'green' : 'rose'}>
                  {deal.unitPriceUsd ? `FOB USD ${deal.unitPriceUsd}/kg` : 'Unit price empty'}
                </Badge>
                <Badge tone="slate">
                  {progress.doneCount}/{progress.total} done
                </Badge>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      <nav className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {mobilePrimary.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium ${
                  isActive ? 'bg-teal-50 text-teal-800' : 'text-slate-500'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {menuOpen ? (
        <div className="no-print fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white">
                  EH
                </div>
                <div>
                  <div className="text-sm font-semibold">ExportHub</div>
                  <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Menu</div>
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                onClick={() => setMenuOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {groups.map((group) => (
                <div key={group.title} className="mb-5">
                  <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {group.title}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                            isActive ? 'bg-teal-50 text-teal-900' : 'text-slate-700'
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 p-4">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <Button variant="secondary" className="w-full">
                  <Sparkles className="h-4 w-4" />
                  Marketing & pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
