import { NavLink, Outlet } from 'react-router-dom'
import {
  Boxes,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  Ship,
  Users,
} from 'lucide-react'
import { useStore } from '../lib/StoreContext'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/shipments', label: 'Shipments', icon: Ship },
  { to: '/buyers', label: 'Buyers', icon: Users },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/settings', label: 'Company', icon: Settings },
]

export function AppShell() {
  const { data } = useStore()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="no-print flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-200 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
                <Boxes className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-wide text-slate-900">ExportHub</div>
                <div className="text-xs text-slate-500">Exporter workspace</div>
              </div>
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
                    isActive
                      ? 'bg-teal-50 text-teal-800'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-200 p-4 text-xs text-slate-500">
            <div className="font-medium text-slate-700">{data.company.name}</div>
            <div>IEC {data.company.iec}</div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-8">
              <div>
                <div className="text-sm font-semibold text-slate-900 lg:hidden">ExportHub</div>
                <div className="hidden text-sm text-slate-500 lg:block">
                  Manage buyers, products, shipments & export documents
                </div>
              </div>
              <div className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
                Demo data · saved locally
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
