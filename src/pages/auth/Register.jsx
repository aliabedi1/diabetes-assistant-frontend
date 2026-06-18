import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuthStore } from "../../store/auth.store";
import { getApiError } from "../../utils/apiErrors";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const [form, setForm] = useState({ username: "", name: "", last_name: "", email: "", password: "", password_confirmation: "" });
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
    <AuthLayout title={t("auth.createAccount")} subtitle={t("auth.registerSubtitle")}>
      <form onSubmit={submit} className="space-y-5">
        <Alert>{error}</Alert>
        <Input label={t("auth.name")} name="name" value={form.name} onChange={updateField} placeholder={t("auth.namePlaceholder")} required />
        <Input label={t("auth.lastName")} name="last_name" value={form.last_name} onChange={updateField} placeholder={t("auth.lastNamePlaceholder")} required />
        <Input label={t("auth.email")} name="email" type="email" value={form.email} onChange={updateField} placeholder={t("auth.emailPlaceholder")} required />
        <Input label={t("auth.username")} name="username" type="text" value={form.username} onChange={updateField} placeholder={t("auth.username")} required />

        <Input label={t("auth.password")} name="password" type="password" value={form.password} onChange={updateField} placeholder={t("auth.passwordPlaceholder")} required minLength="6" />
        <Input label={t("auth.confirmPassword")} name="password_confirmation" type="password" value={form.password_confirmation} onChange={updateField} placeholder={t("auth.passwordPlaceholder")} required minLength="6" />
        <Button className="w-full" disabled={loading}>
          {loading ? (t("auth.creating") || "Creating account...") : (t("auth.register") || "Register")}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        {t("auth.haveAccount")} <Link to="/login" className="font-bold text-sky-600 dark:text-sky-400">{t("auth.signIn")}</Link>
      </p>
    </AuthLayout>
  );
}
