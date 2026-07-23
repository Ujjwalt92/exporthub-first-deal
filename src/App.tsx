import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './lib/StoreContext'
import { AppShell } from './components/AppShell'
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

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="company" element={<CompanyPage />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
