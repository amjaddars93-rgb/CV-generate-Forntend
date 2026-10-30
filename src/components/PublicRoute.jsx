import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function PublicRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="center">Checking session…</div>;
  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
