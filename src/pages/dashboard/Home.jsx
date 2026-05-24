import { useEffect, useState } from "react";
import { getLogs, createLog } from "../../services/glucose.service";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Home() {
    const [logs, setLogs] = useState([]);
    const [value, setValue] = useState("");

    async function load() {
        const res = await getLogs();
        setLogs(res.data);
    }

    async function add(e) {
        e.preventDefault();

        await createLog({
            glucose_amount: value,
            logged_at: new Date()
        });

        setValue("");
        load();
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="p-10 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">
                Glucose Dashboard
            </h1>

            <Card>
                <form onSubmit={add} className="flex gap-3">
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Glucose value"
                    />
                    <Button>Add</Button>
                </form>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {logs.map((l) => (
                    <Card key={l.id}>
                        <div className="text-xl font-bold">
                            {l.glucose_amount}
                        </div>
                        <div className="text-gray-500">
                            {l.logged_at}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}