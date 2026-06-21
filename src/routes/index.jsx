import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import GlucoseLogs from "../pages/glucose/GlucoseLogs";
import MedicalLogs from "../pages/medical/MedicalLogs";
import DailyJournal from "../pages/archive/DailyJournal";
import MasterArchive from "../pages/archive/MasterArchive";
import NotFound from "../pages/notfound/NotFound";

import ProtectedRoute from "./ProtectedRoutes";
import GuestRoute from "./GuestRoute";
import DashboardLayout from "../layouts/DashboardLayout";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

            {/* Protected App */}
            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/journal" element={<DailyJournal />} />
                <Route path="/archive" element={<MasterArchive />} />
                <Route path="/glucose" element={<GlucoseLogs />} />
                <Route path="/medical" element={<MedicalLogs />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
