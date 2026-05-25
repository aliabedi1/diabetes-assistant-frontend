import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuthStore } from "../../store/auth.store";
import { getApiError } from "../../utils/apiErrors";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to login with these credentials."));
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Login with your Laravel API account.">
      <form onSubmit={submit} className="space-y-5">
        <Alert>{error}</Alert>
        <Input label="Email" name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" required />
        <Input label="Password" name="password" type="password" value={form.password} onChange={updateField} placeholder="••••••••" required />
        <Button className="w-full" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        No account yet? <Link to="/register" className="font-bold text-sky-600">Create one</Link>
      </p>
    </AuthLayout>
  );
}
