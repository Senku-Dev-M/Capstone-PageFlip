"use client";

import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";

import { auth } from "@/lib/firebase";

const neonButtonClasses =
  "relative inline-flex w-full items-center justify-center rounded-full border border-teal-400/60 bg-teal-400/90 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-950 transition duration-200 hover:bg-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60";

type LoginDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
};

export default function LoginDialog({
  isOpen,
  onClose,
  onSwitchToRegister,
}: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = () => {
    setError(null);
    setStatus(null);
    setEmail("");
    setPassword("");
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSwitchToRegister = () => {
    resetState();
    onSwitchToRegister();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus(null);
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setStatus("Connection established. Welcome back, operator.");
    } catch (err) {
      const message =
        err instanceof FirebaseError
          ? err.message
          : "Unable to authenticate. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-6 backdrop-blur">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-teal-400/40 bg-slate-950/95 p-8 text-slate-100 shadow-[0_0_55px_rgba(34,211,238,0.45)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-teal-500/30 blur-3xl" />
          <div className="absolute -right-20 top-12 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close login dialog"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-teal-400/40 bg-slate-950/80 text-teal-200 transition hover:text-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="relative space-y-8">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.65em] text-teal-300/80">
              Authentication
            </p>
            <h2 className="text-3xl font-semibold text-teal-200">
              Secure Access Terminal
            </h2>
            <p className="text-sm text-slate-400">
              Route your credentials through the encrypted uplink to rejoin the PageFlip grid.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="text-xs font-semibold uppercase tracking-[0.4em] text-teal-200"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-teal-400/30 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 shadow-[0_0_25px_rgba(34,211,238,0.15)] transition focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300/60"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-xs font-semibold uppercase tracking-[0.4em] text-teal-200"
              >
                Access Key
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-teal-400/30 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 shadow-[0_0_25px_rgba(34,211,238,0.15)] transition focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300/60"
              />
            </div>

            {error ? (
              <p className="rounded-xl border border-pink-500/40 bg-pink-500/10 px-4 py-3 text-xs font-medium text-pink-200 shadow-[0_0_25px_rgba(236,72,153,0.25)]">
                {error}
              </p>
            ) : null}

            {status ? (
              <p className="rounded-xl border border-teal-400/60 bg-teal-400/10 px-4 py-3 text-xs font-medium text-teal-200 shadow-[0_0_25px_rgba(45,212,191,0.35)]">
                {status}
              </p>
            ) : null}

            <button type="submit" className={neonButtonClasses} disabled={isSubmitting}>
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-900/60 border-t-transparent" />
                ) : null}
                <span>{isSubmitting ? "Linking" : "Connect"}</span>
              </span>
            </button>
          </form>
          <div className="pt-4 text-center">
            <p className="text-xs text-slate-400">
              Need to register?
              {" "}
              <button
                type="button"
                onClick={handleSwitchToRegister}
                className="font-semibold uppercase tracking-[0.3em] text-teal-200 transition hover:text-teal-100"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
