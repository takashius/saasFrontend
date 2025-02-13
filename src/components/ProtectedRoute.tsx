import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  element: React.ReactNode
  path: string
  exact?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { token } = useAuth()
  return token ? element : (
    <Navigate to="/login" />
  )
}

export default ProtectedRoute
