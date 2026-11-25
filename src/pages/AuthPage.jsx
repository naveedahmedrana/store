import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Input, Label, Select, useDocumentTitle } from "../components/ui";
import { PHONE } from "../lib";
import { useStore } from "../store";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </svg>
  );
}

function Row({ htmlFor, label, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

const tabBase =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow";

export default function AuthPage() {
  const [params] = useSearchParams();
  const redirectParam = params.get("redirect");
  const redirect =
    redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//") && !redirectParam.startsWith("/auth")
      ? redirectParam
      : "/";
  const [tab, setTab] = useState(params.get("mode") === "signup" ? "signup" : "signin");
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [gender, setGender] = useState("");
  const { user, signIn, signUp, notify } = useStore();
  const navigate = useNavigate();
  useDocumentTitle("Sign in or join — store.pk");

  if (user) return <Navigate to={redirect} replace />;

  function onGoogle() {
    notify("Sign-in failed", "Google sign-in isn't enabled on this site yet. Please continue with email.");
  }

  function onSignIn(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    const result = signIn(String(form.get("email") ?? ""), String(form.get("password") ?? ""));
    setBusy(false);
    if (!result.ok) {
      notify("Couldn't sign in", result.error);
      return;
    }
    navigate(redirect, { replace: true });
  }

  function onSignUp(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    if (password.length < 8) {
      notify("Password must be at least 8 characters");
      return;
    }
    const fullName = String(form.get("fullName") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const city = String(form.get("city") ?? "").trim();
    const address = String(form.get("address") ?? "").trim();
    const problem =
      (fullName.length < 2 && "Enter your full name") ||
      (!PHONE.test(phone) && "Enter a Pakistani mobile number, e.g. 0300 1234567") ||
      (!gender && "Invalid input") ||
      (city.length < 2 && "Enter your city") ||
      (address.length < 5 && "Enter your address");
    if (problem) {
      notify(problem);
      return;
    }
    setBusy(true);
    const result = signUp({ fullName, email: email.trim(), password, phone, gender, city, address });
    setBusy(false);
    if (!result.ok) {
      notify("Couldn't create account", result.error);
      return;
    }
    navigate(redirect, { replace: true });
  }

  function onForgot(event) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    navigate(`/reset-password?email=${encodeURIComponent(email)}`);
  }

  return (
    <div className="container-page flex justify-center py-12">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-card">
        {forgot ? (
          <form onSubmit={onForgot} className="space-y-4">
            <h1 className="text-2xl font-bold">Reset password</h1>
            <p className="text-sm text-muted-foreground">We'll email you a link to set a new password.</p>
            <Row htmlFor="forgot-email" label="Email">
              <Input id="forgot-email" name="email" type="email" required />
            </Row>
            <Button type="submit" className="w-full" disabled={busy}>
              Send reset link
            </Button>
            <button type="button" className="w-full text-sm text-primary hover:underline" onClick={() => setForgot(false)}>
              Back to sign in
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Welcome to store.pk</h1>
              <p className="mt-1 text-sm text-muted-foreground">Order wholesale and talk to suppliers across Pakistan.</p>
            </div>
            <div className="space-y-2.5">
              <button
                type="button"
                className="google-button inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-full text-sm"
                onClick={onGoogle}
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
            </div>
            <div>
              <div role="tablist" className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground grid w-full grid-cols-2">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "signin"}
                  data-state={tab === "signin" ? "active" : "inactive"}
                  onClick={() => setTab("signin")}
                  className={tabBase}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "signup"}
                  data-state={tab === "signup" ? "active" : "inactive"}
                  onClick={() => setTab("signup")}
                  className={tabBase}
                >
                  Create account
                </button>
              </div>
              {tab === "signin" ? (
                <form onSubmit={onSignIn} className="mt-2 space-y-4 pt-4">
                  <Row htmlFor="in-email" label="Email">
                    <Input id="in-email" name="email" type="email" autoComplete="email" required />
                  </Row>
                  <Row htmlFor="in-password" label="Password">
                    <Input id="in-password" name="password" type="password" autoComplete="current-password" required />
                  </Row>
                  <Button type="submit" variant="cta" className="h-11 w-full" disabled={busy}>
                    Sign in
                  </Button>
                  <button type="button" className="w-full text-sm text-primary hover:underline" onClick={() => setForgot(true)}>
                    Forgot password?
                  </button>
                </form>
              ) : (
                <form onSubmit={onSignUp} className="mt-2 space-y-4 pt-4">
                  <Row htmlFor="up-name" label="Full name">
                    <Input id="up-name" name="fullName" autoComplete="name" placeholder="e.g. Naveed Ahmed" required />
                  </Row>
                  <div className="grid grid-cols-2 gap-3">
                    <Row htmlFor="up-phone" label="Mobile number">
                      <Input id="up-phone" name="phone" type="tel" autoComplete="tel" placeholder="0300 1234567" required />
                    </Row>
                    <div className="space-y-1.5">
                      <Label>Gender</Label>
                      <Select
                        value={gender}
                        onValueChange={setGender}
                        placeholder="Select"
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                          { value: "other", label: "Other" },
                        ]}
                      />
                    </div>
                  </div>
                  <Row htmlFor="up-city" label="City">
                    <Input id="up-city" name="city" autoComplete="address-level2" placeholder="e.g. Lahore" required />
                  </Row>
                  <Row htmlFor="up-address" label="Address">
                    <Input id="up-address" name="address" autoComplete="street-address" placeholder="Street, area" required />
                  </Row>
                  <Row htmlFor="up-email" label="Email">
                    <Input id="up-email" name="email" type="email" autoComplete="email" required />
                  </Row>
                  <Row htmlFor="up-password" label="Password (min. 8 characters)">
                    <Input id="up-password" name="password" type="password" autoComplete="new-password" minLength={8} required />
                  </Row>
                  <Button type="submit" variant="cta" className="h-11 w-full" disabled={busy}>
                    Create free account
                  </Button>
                </form>
              )}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">
                Continue browsing without signing in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ResetPage() {
  const { resetPassword, notify } = useStore();
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  useDocumentTitle("Reset password — store.pk");

  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    if (password.length < 8) {
      notify("Password must be at least 8 characters");
      return;
    }
    setBusy(true);
    const result = resetPassword(String(form.get("email") ?? "").trim(), password);
    setBusy(false);
    if (!result.ok) {
      notify("Couldn't update password", result.error);
      return;
    }
    notify("Password updated");
    navigate("/");
  }

  return (
    <div className="container-page flex justify-center py-12">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl border bg-card p-8 shadow-card">
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <Row htmlFor="reset-email" label="Email">
          <Input id="reset-email" name="email" type="email" defaultValue={params.get("email") ?? ""} required />
        </Row>
        <Row htmlFor="new-password" label="New password">
          <Input id="new-password" name="password" type="password" minLength={8} required />
        </Row>
        <Button type="submit" className="h-11 w-full" disabled={busy}>
          Save password
        </Button>
      </form>
    </div>
  );
}
