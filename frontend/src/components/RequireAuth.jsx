import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAppContext from "../hooks/useAppContext";
import { jwtDecode } from 'jwt-decode'

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAppContext()
  const location = useLocation()
  const decoded = auth?.accessToken
    ? jwtDecode(auth.accessToken) : undefined
  const roles = decoded?.UserInfo?.roles || []

  return (
    roles.find(role => allowedRoles?.includes(role))
      ? <Outlet />
      : auth?.accessToken
        ? <Navigate to='/unauthorized' state={{ from: location }} replace />
        : <Navigate to='/login' state={{ from: location }} replace />
  )
}

export default RequireAuth