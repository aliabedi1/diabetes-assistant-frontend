import { useState } from "react";
import { login } from "../../services/auth.service";
import { setToken } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function Login() {
    const nav = useNavigate();

    const [form, setForm] = useState({
        login: "",
        password: ""
    });

    async function submit(e) {
        e.preventDefault();

        const res = await login(form);

        setToken(res.data.token);

        nav("/dashboard");
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <Card>
                <h1 className="text-2xl font-bold mb-4">Login</h1>

                <form onSubmit={submit} className="space-y-3 w-80">
                    <Input
                        placeholder="Email or Username"
                        onChange={(e) =>
                            setForm({ ...form, login: e.target.value })
                        }
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />

                    <Button className="w-full">Login</Button>
                </form>
            </Card>
        </div>
    );
}