import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { StoreProvider } from './lib/StoreContext'
import { ToastProvider } from './components/Toast'
import { AppShell } from './components/AppShell'
import { LandingPage } from './pages/LandingPage'
import { PricingPage } from './pages/PricingPage'
import { HomePage } from './pages/HomePage'
import { RulesPage } from './pages/RulesPage'
import { ClarifyPage } from './pages/ClarifyPage'
import { CostSheetPage } from './pages/CostSheetPage'
import { ProformaPage } from './pages/ProformaPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { LessonPage } from './pages/LessonPage'
import { PoLcPage } from './pages/PoLcPage'
import { VendorPage } from './pages/VendorPage'
import { CompanyPage } from './pages/CompanyPage'
import { ProductionPage } from './pages/ProductionPage'
import { DispatchPage } from './pages/DispatchPage'
import { CustomsPage } from './pages/CustomsPage'
import { VesselPage } from './pages/VesselPage'
import { PaymentPage } from './pages/PaymentPage'
import { CommercialInvoicePage } from './pages/CommercialInvoicePage'
import { PackingListPage } from './pages/PackingListPage'
import { TemplatesPage } from './pages/TemplatesPage'
import { HelpPage } from './pages/HelpPage'
import { SampleLcPage } from './pages/SampleLcPage'
import { FobMathPage } from './pages/FobMathPage'
import { QualitySpecsPage } from './pages/QualitySpecsPage'
import { ChaChecklistPage } from './pages/ChaChecklistPage'
import { BankDocsPage } from './pages/BankDocsPage'
import { PostShipmentPage } from './pages/PostShipmentPage'
import { BeginnerGuidePage } from './pages/BeginnerGuidePage'
import { StartHerePage } from './pages/StartHerePage'
import { CompletionReportPage } from './pages/CompletionReportPage'
import { SettingsPage } from './pages/SettingsPage'
import { LoginPage, SignupPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { BillingPage, TeamPage } from './pages/BillingPage'
import { AcceptInvitePage } from './pages/AcceptInvitePage'

function RequireAuth() {
  const { user, bootstrapping } = useAuth()
  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Starting ExportHub…
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

function RequireDeal() {
  const { activeDealId, deals, bootstrapping } = useAuth()
  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading deal…
      </div>
    )
  }
  if (!activeDealId) {
    if (deals[0]) return <Navigate to="/app" replace />
    return <Navigate to="/app" replace />
  }
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<RequireAuth />}>
              <Route path="/app" element={<DashboardPage />} />
              <Route path="/app/billing" element={<BillingPage />} />
              <Route path="/app/team" element={<TeamPage />} />
              <Route path="/accept-invite" element={<AcceptInvitePage />} />
              <Route element={<RequireDeal />}>
                <Route path="workspace" element={<HomePage />} />
                <Route path="start-here" element={<StartHerePage />} />
                <Route path="beginner" element={<BeginnerGuidePage />} />
                <Route path="company" element={<CompanyPage />} />
                <Route path="report" element={<CompletionReportPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="rules" element={<RulesPage />} />
                <Route path="clarify" element={<ClarifyPage />} />
                <Route path="cost-sheet" element={<CostSheetPage />} />
                <Route path="fob-math" element={<FobMathPage />} />
                <Route path="proforma" element={<ProformaPage />} />
                <Route path="po-lc" element={<PoLcPage />} />
                <Route path="sample-lc" element={<SampleLcPage />} />
                <Route path="vendor" element={<VendorPage />} />
                <Route path="production" element={<ProductionPage />} />
                <Route path="quality" element={<QualitySpecsPage />} />
                <Route path="dispatch" element={<DispatchPage />} />
                <Route path="customs" element={<CustomsPage />} />
                <Route path="cha-checklist" element={<ChaChecklistPage />} />
                <Route path="vessel" element={<VesselPage />} />
                <Route path="payment" element={<PaymentPage />} />
                <Route path="bank-docs" element={<BankDocsPage />} />
                <Route path="post-shipment" element={<PostShipmentPage />} />
                <Route path="documents" element={<DocumentsPage />} />
                <Route path="documents/commercial-invoice" element={<CommercialInvoicePage />} />
                <Route path="documents/packing-list" element={<PackingListPage />} />
                <Route path="templates" element={<TemplatesPage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="lesson" element={<LessonPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
