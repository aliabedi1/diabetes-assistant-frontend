import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function RegisterPage() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        name: "",
        last_name: "",
        email: "",
        password: "",
    });

    async function submit(e) {
        e.preventDefault();

        const response = await api.post("/register", form);

        localStorage.setItem("token", response.data.token);

        navigate("/dashboard");
    }

    return (
        <div className="min-h-screen flex items-center justify-center">

            <form
                onSubmit={submit}
                className="bg-white p-8 rounded-2xl shadow w-[400px]"
            >

                <h1 className="text-3xl font-bold mb-6">
                    Register
                </h1>

                <input
                    className="w-full border p-3 rounded mb-3"
                    placeholder="Username"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            username: e.target.value
                        })
                    }
                />

                <input
                    className="w-full border p-3 rounded mb-3"
                    placeholder="Name"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value
                        })
                    }
                />

                <input
                    className="w-full border p-3 rounded mb-3"
                    placeholder="Last Name"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            last_name: e.target.value
                        })
                    }
                />

                <input
                    className="w-full border p-3 rounded mb-3"
                    placeholder="Email"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            email: e.target.value
                        })
                    }
                />

                <input
                    type="password"
                    className="w-full border p-3 rounded mb-3"
                    placeholder="Password"
                    onChange={(e) =>
                        setForm({
                            ...form,
                            password: e.target.value
                        })
                    }
                />

                <button
                    className="w-full bg-blue-500 text-white p-3 rounded"
                >
                    Register
                </button>

            </form>

        </div>
    )
}

export default RegisterPage;