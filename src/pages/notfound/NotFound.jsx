import { useEffect, useState } from "react";
import api from "../../services/api";

function DashboardPage() {

    const [glucoseAmount, setGlucoseAmount] = useState("");

    const [logs, setLogs] = useState([]);

    async function loadLogs() {
        const response = await api.get("/glucose-logs");

        setLogs(response.data);
    }

    async function submit(e) {
        e.preventDefault();

        await api.post("/glucose-logs", {
            glucose_amount: glucoseAmount,
            logged_at: new Date(),
        });

        setGlucoseAmount("");

        loadLogs();
    }

    useEffect(() => {
        loadLogs();
    }, []);

    return (
        <div className="p-10">

            <h1 className="text-4xl font-bold mb-8">
                Dashboard
            </h1>

            <form
                onSubmit={submit}
                className="bg-white p-6 rounded-2xl shadow mb-8"
            >

                <h2 className="text-2xl mb-4">
                    Add Glucose
                </h2>

                <input
                    value={glucoseAmount}
                    onChange={(e) =>
                        setGlucoseAmount(e.target.value)
                    }
                    className="border p-3 rounded w-full mb-4"
                    placeholder="Glucose Amount"
                />

                <button
                    className="bg-blue-500 text-white p-3 rounded"
                >
                    Save
                </button>

            </form>

            <div className="space-y-4">

                {logs.map((log) => (
                    <div
                        key={log.id}
                        className="bg-white p-4 rounded-xl shadow"
                    >
                        <div>
                            Glucose: {log.glucose_amount}
                        </div>

                        <div>
                            Date: {log.logged_at}
                        </div>
                    </div>
                ))}

            </div>

        </div>
    )
}

export default DashboardPage;