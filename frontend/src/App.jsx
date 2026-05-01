import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/authStore.js'
import Login from './pages/Login.jsx'
import ChatsLayout from './pages/ChatsLayout.jsx'

const queryClient = new QueryClient()

function AppContent() {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/"
        element={
          isAuthenticated
            ? <ChatsLayout />
            : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/chats/:id"
        element={
          isAuthenticated
            ? <ChatsLayout />
            : <Navigate to="/login" replace />
        }
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
      />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}