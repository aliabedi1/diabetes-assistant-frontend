import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function ProtectedRoute({ children }) {
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const location = useLocation();

    // Startup loadUser() validates via /auth/me; allow if user is set OR a fresh token exists
    // (login may not return user in its response — on next page load loadUser() will validate)
    if (!user && !token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
}
