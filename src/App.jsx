import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./Auth/AuthContext"
import ProtectedRoute from "./Auth/ProtectedRoute"
import LoginPage from './pages/Login'  
import Dashboard from './pages/Dashboard'
import CreateReservation from './pages/CreateReservation';
import ReadReservation from './pages/ReadReservation';
import CrudReservation from './pages/Crud'

function AppRoutes() {
  const { logout } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Dashboard onLogout={logout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard/create" replace />} />
        <Route path="create" element={<CreateReservation />} />
        <Route path="read" element={<ReadReservation />} />
        <Route path="crud" element={<CrudReservation />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App