import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './lib/StoreContext'
import { AppShell } from './components/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { BuyersPage } from './pages/BuyersPage'
import { ProductsPage } from './pages/ProductsPage'
import { ShipmentsPage } from './pages/ShipmentsPage'
import { ShipmentDetailPage } from './pages/ShipmentDetailPage'
import { ShipmentFormPage } from './pages/ShipmentFormPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { InvoiceDocumentPage } from './pages/InvoiceDocumentPage'
import { PackingListDocumentPage } from './pages/PackingListDocumentPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="buyers" element={<BuyersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="shipments" element={<ShipmentsPage />} />
            <Route path="shipments/new" element={<ShipmentFormPage key="new" />} />
            <Route path="shipments/:id" element={<ShipmentDetailPage />} />
            <Route path="shipments/:id/edit" element={<ShipmentFormPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="documents/:id/invoice" element={<InvoiceDocumentPage />} />
            <Route path="documents/:id/packing-list" element={<PackingListDocumentPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
