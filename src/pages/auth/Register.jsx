import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuthStore } from "../../store/auth.store";
import { getApiError } from "../../utils/apiErrors";

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [error, setError] = useState("");

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/dashboard");
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to create your account."));
    }
  }

  return (
    <AuthLayout title="Create account" subtitle="Start tracking glucose and medical logs.">
      <form onSubmit={submit} className="space-y-5">
        <Alert>{error}</Alert>
        <Input label="Name" name="name" value={form.name} onChange={updateField} placeholder="Your name" required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" required />
        <Input label="Password" name="password" type="password" value={form.password} onChange={updateField} placeholder="Minimum 8 characters" required minLength="8" />
        <Input label="Confirm password" name="password_confirmation" type="password" value={form.password_confirmation} onChange={updateField} placeholder="Repeat password" required minLength="8" />
        <Button className="w-full" disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account? <Link to="/login" className="font-bold text-sky-600">Login</Link>
      </p>
    </AuthLayout>
  );
}
