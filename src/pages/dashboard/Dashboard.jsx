import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        api.get("/glucose/logs").then((res) => {
            setLogs(res.data);
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">
                Diabetes Dashboard
            </h1>

            <div className="grid gap-4 md:grid-cols-2">
                {logs.map((l) => (
                    <div
                        key={l.id}
                        className="bg-white p-4 rounded-xl shadow"
                    >
                        <div className="text-xl font-bold">
                            {l.glucose_amount}
                        </div>
                        <div className="text-gray-500">
                            {l.logged_at}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}