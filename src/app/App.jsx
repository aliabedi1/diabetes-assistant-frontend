import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";
import AppRoutes from "../routes";

export default function App() {
    const loadUser = useAuthStore((state) => state.loadUser);
    const authChecked = useAuthStore((state) => state.authChecked);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    if (!authChecked) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
            </div>
        );
    }

    return <AppRoutes />;
}
