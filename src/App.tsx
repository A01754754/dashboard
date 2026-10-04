import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AppLayout } from './layout/AppLayout'
import { LandingPage } from './pages/LandingPage'
import { AlertsPage } from './pages/AlertsPage'
import { FollowupsPage } from './pages/FollowupsPage'
import { PlotPage } from './pages/PlotPage'
import { ResolvedPage } from './pages/ResolvedPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: true } },
})

// "/" is the landing page; the dashboard lives under /panel. No login: whoever operates it approves or rejects alerts.
function AppRoutes() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="panel" element={<AppLayout />}>
        <Route index element={null} />
        <Route path="parcela/:plotId" element={<PlotPage />} />
        <Route path="alertas" element={<AlertsPage />} />
        <Route path="seguimientos" element={<FollowupsPage />} />
        <Route path="casos-resueltos" element={<ResolvedPage />} />
        <Route path="*" element={<Navigate to="/panel" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
