import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { btn, Field, inputClass, useDocumentTitle } from "../components/ui";
import { PHONE } from "../lib";
import { useStore } from "../store";

export default function AuthPage() {
  const [params] = useSearchParams();
  const initial = params.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, signIn, signUp } = useStore();
  const navigate = useNavigate();
  const redirect = params.get("redirect") || "/";
  useDocumentTitle("Sign in or join — store.pk");

  if (user) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-2xl font-bold">You're signed in</h1>
        <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
        <Link to={redirect} className={`${btn("cta")} mt-6`}>Continue</Link>
      </div>
    );
  }

  function finish() {
    navigate(redirect);
  }

  function onSignIn(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    const result = signIn(String(data.email || ""), String(data.password || ""));
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    finish();
  }

  function onSignUp(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (!data.fullName || data.fullName.trim().length < 2) return setError("Enter your name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return setError("Enter a valid email");
    if (String(data.password).length < 8) return setError("Password must be at least 8 characters");
    if (!PHONE.test(String(data.phone).trim())) return setError("Enter a Pakistani mobile number, e.g. 0300 1234567");
    if (!data.gender) return setError("Select a gender");
    if (!data.city || data.city.trim().length < 2) return setError("Enter your city");
    if (!data.address || data.address.trim().length < 5) return setError("Enter a delivery address");
    setBusy(true);
    const result = signUp({
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      password: data.password,
      phone: data.phone.trim(),
      gender: data.gender,
      city: data.city.trim(),
      address: data.address.trim(),
    });
    setBusy(false);
    if (!result.ok) return setError(result.error);
    finish();
  }

  return (
    <div className="container-page grid items-center gap-10 py-12 lg:grid-cols-2">
      <section className="max-w-md">
        <h1 className="text-4xl font-extrabold">Welcome to store.pk</h1>
        <p className="mt-3 text-muted-foreground">Order wholesale and talk to suppliers across Pakistan.</p>
      </section>
      <section className="rounded-2xl border bg-card p-6 shadow-card md:p-8">
        <div className="mb-6 grid grid-cols-2 rounded-full bg-muted p-1 text-sm font-semibold">
          <button className={`h-10 rounded-full ${mode === "signin" ? "bg-white shadow-card" : "text-muted-foreground"}`} onClick={() => { setMode("signin"); setError(""); }}>
            Sign in
          </button>
          <button className={`h-10 rounded-full ${mode === "signup" ? "bg-white shadow-card" : "text-muted-foreground"}`} onClick={() => { setMode("signup"); setError(""); }}>
            Create account
          </button>
        </div>
        {error && <p className="mb-4 rounded-lg bg-cta-soft px-3 py-2 text-sm text-destructive">{error}</p>}
        {mode === "signin" ? (
          <form onSubmit={onSignIn} className="space-y-4" noValidate>
            <Field label="Email"><input name="email" type="email" autoComplete="email" required className={inputClass} /></Field>
            <Field label="Password"><input name="password" type="password" autoComplete="current-password" required className={inputClass} /></Field>
            <button className={`${btn("cta", "xl")} w-full`} disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
            <Link to="/reset-password" className="block text-center text-sm text-primary hover:underline">Forgot password?</Link>
          </form>
        ) : (
          <form onSubmit={onSignUp} className="space-y-4" noValidate>
            <Field label="Full name"><input name="fullName" placeholder="e.g. Naveed Ahmed" autoComplete="name" className={inputClass} /></Field>
            <Field label="Mobile number"><input name="phone" placeholder="0300 1234567" className={inputClass} /></Field>
            <Field label="Gender">
              <select name="gender" defaultValue="" className={inputClass}>
                <option value="" disabled>Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
            <Field label="City"><input name="city" placeholder="e.g. Lahore" className={inputClass} /></Field>
            <Field label="Address"><input name="address" placeholder="Street, area" className={inputClass} /></Field>
            <Field label="Email"><input name="email" type="email" autoComplete="email" className={inputClass} /></Field>
            <Field label="Password (min. 8 characters)"><input name="password" type="password" autoComplete="new-password" className={inputClass} /></Field>
            <button className={`${btn("cta", "xl")} w-full`} disabled={busy}>{busy ? "Creating account…" : "Create free account"}</button>
          </form>
        )}
        <Link to="/" className="mt-4 block text-center text-sm text-primary hover:underline">Continue browsing without signing in</Link>
      </section>
    </div>
  );
}

export function ResetPage() {
  const { resetPassword } = useStore();
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  useDocumentTitle("Reset password — store.pk");

  function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (String(data.password).length < 8) return setError("Password must be at least 8 characters");
    const result = resetPassword(String(data.email).trim(), data.password);
    if (!result.ok) return setError(result.error);
    setDone(true);
  }

  return (
    <div className="container-page flex justify-center py-16">
      <section className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-card md:p-8">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Set a new password for the account saved on this device.</p>
        {done ? (
          <button className={`${btn("cta", "xl")} mt-6 w-full`} onClick={() => navigate("/auth")}>Back to sign in</button>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Field label="Email"><input name="email" type="email" required className={inputClass} /></Field>
            <Field label="New password"><input name="password" type="password" required className={inputClass} /></Field>
            <button className={`${btn("cta", "xl")} w-full`}>Update password</button>
            <button type="button" className="w-full text-sm text-primary hover:underline" onClick={() => navigate("/auth")}>Back to sign in</button>
          </form>
        )}
      </section>
    </div>
  );
}
