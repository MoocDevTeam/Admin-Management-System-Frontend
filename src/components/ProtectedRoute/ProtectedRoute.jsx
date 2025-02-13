import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}
export default ProtectedRoute
