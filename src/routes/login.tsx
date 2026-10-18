import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Hexagon, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { seo } from "@/lib/seo";
import { checkCredentials, hasSession, startSession, DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/demo-auth";

export const Route = createFileRoute("/login")({
  head: () => seo("Sign in", "Sign in to your Studio Command workspace."),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasSession()) navigate({ to: "/", replace: true });
  }, [navigate]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (loading) return;
    if (!checkCredentials(email, password)) {
      setError("Incorrect email or password. Use the demo account below.");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      startSession();
      navigate({ to: "/", replace: true });
    }, 700);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-[-200px] right-[-120px] h-[420px] w-[420px] rounded-full bg-info/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="rounded-2xl border bg-surface/60 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            <div className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <Hexagon className="size-5" strokeWidth={2.5} />
            </div>
            <div className="mt-3 text-lg font-black tracking-tight">Studio Command</div>
            <h1 className="mt-5 text-xl font-bold tracking-tight">Sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">Access your workspace.</p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <Input
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
            />
            <div className="relative">
              <Input
                type={show ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {error && <p className="text-xs font-medium text-bad">{error}</p>}
            <Button type="submit" variant="glow" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 rounded-xl border bg-background/50 p-3 text-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Demo account</div>
            <div className="mt-1.5 font-mono text-xs text-foreground/80">{DEMO_EMAIL}</div>
            <div className="font-mono text-xs text-foreground/80">{DEMO_PASSWORD}</div>
            <button
              type="button"
              onClick={() => { setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); setError(""); }}
              className="mt-2 text-xs font-semibold text-primary hover:underline"
            >
              Use Demo Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
