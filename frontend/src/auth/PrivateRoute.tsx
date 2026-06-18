import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import { type ReactNode } from "react"

export default function PrivateRoute({ children }: { children: ReactNode }) {
    const {user, loading} = useAuth();
    if (loading) return <div>Nalaganje...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
}