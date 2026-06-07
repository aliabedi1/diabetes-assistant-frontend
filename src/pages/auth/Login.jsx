import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuthStore } from "../../store/auth.store";
import { getApiError } from "../../utils/apiErrors";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState(localStorage.getItem("auth_flash_message") || "");

  useEffect(() => {
    if (localStorage.getItem("auth_flash_message")) {
      localStorage.removeItem("auth_flash_message");
      localStorage.removeItem("auth_flash_type");
    }
  }, []);

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
    <AuthLayout title={t("auth.welcomeBack")} subtitle={t("auth.loginSubtitle")}>
      <form onSubmit={submit} className="space-y-5">
        <Alert type="info">{info}</Alert>
        <Alert>{error}</Alert>
        <Input label={t("auth.email")} name="email" type="email" value={form.email} onChange={updateField} placeholder={t("auth.emailPlaceholder")} required />
        <Input label={t("auth.password")} name="password" type="password" value={form.password} onChange={updateField} placeholder={t("auth.passwordPlaceholder")} required />
        <Button className="w-full" disabled={loading}>{loading ? t("auth.signingIn") : t("auth.login")}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        {(t("auth.noAccount") || "No account yet?")} <Link to="/register" className="font-bold text-sky-600 dark:text-sky-400">{t("auth.createOne") || "Create one"}</Link>
      </p>
    </AuthLayout>
  );
}
