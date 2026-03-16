import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function RoleGuard({ children, allowedRoles }) {
  const { hasRole, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default RoleGuard
