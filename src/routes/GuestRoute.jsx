import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function GuestRoute({ children }) {
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);

    if (user || token) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
