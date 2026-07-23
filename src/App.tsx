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

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="rules" element={<RulesPage />} />
            <Route path="clarify" element={<ClarifyPage />} />
            <Route path="cost-sheet" element={<CostSheetPage />} />
            <Route path="proforma" element={<ProformaPage />} />
            <Route path="po-lc" element={<PoLcPage />} />
            <Route path="vendor" element={<VendorPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="lesson" element={<LessonPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
