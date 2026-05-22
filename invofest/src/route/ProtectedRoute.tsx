import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function ProtectedRoute(){
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // JIKA BELUM LOGIN REDERECT KE HALAMAN LOGIN
    if(!isAuthenticated){
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}