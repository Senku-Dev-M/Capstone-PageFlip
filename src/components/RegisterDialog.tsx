"use client";

import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";

import { auth } from "@/lib/firebase";

const neonButtonClasses =
  "relative inline-flex w-full items-center justify-center rounded-full border border-teal-400/60 bg-teal-400/90 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-950 transition duration-200 hover:bg-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60";

type RegisterDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
};

export default function RegisterDialog({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterDialogProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setStatus(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSwitchToLogin = () => {
    resetState();
    onSwitchToLogin();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setStatus(null);

    if (password !== confirmPassword) {
      setError("Access keys do not match. Recalibrate and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (credential.user && username.trim()) {
        await updateProfile(credential.user, { displayName: username.trim() });
      }

      setStatus("Registration successful. Credentials synced with the network.");
    } catch (err) {
      const message =
        err instanceof FirebaseError
          ? err.message
          : "Unable to register. Please verify your inputs.";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-6 backdrop-blur">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-fuchsia-400/40 bg-slate-950/95 p-8 text-slate-100 shadow-[0_0_60px_rgba(217,70,239,0.45)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-24 h-56 w-56 rounded-full bg-fuchsia-500/25 blur-3xl" />
          <div className="absolute -right-16 bottom-12 h-48 w-48 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent" />
          <div className="absolute inset-y-10 left-0 w-px bg-gradient-to-b from-transparent via-teal-400/40 to-transparent" />
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close register dialog"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-fuchsia-400/40 bg-slate-950/80 text-fuchsia-200 transition hover:text-fuchsia-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
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
            <p className="text-xs font-semibold uppercase tracking-[0.65em] text-fuchsia-300/80">
              Registration
            </p>
            <h2 className="text-3xl font-semibold text-fuchsia-200">
              Forge Your PageFlip ID
            </h2>
            <p className="text-sm text-slate-400">
              Configure your credentials to gain trusted access to the literary mainframe.
            </p>
          </header>

          <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label
                htmlFor="register-username"
                className="text-xs font-semibold uppercase tracking-[0.4em] text-fuchsia-200"
              >
                Codename
              </label>
              <input
                id="register-username"
                type="text"
                autoComplete="nickname"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-2xl border border-fuchsia-400/30 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 shadow-[0_0_30px_rgba(217,70,239,0.18)] transition focus:border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="register-email"
                className="text-xs font-semibold uppercase tracking-[0.4em] text-fuchsia-200"
              >
                Email Address
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-fuchsia-400/30 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 shadow-[0_0_30px_rgba(217,70,239,0.18)] transition focus:border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="register-password"
                className="text-xs font-semibold uppercase tracking-[0.4em] text-fuchsia-200"
              >
                Access Key
              </label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-fuchsia-400/30 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 shadow-[0_0_30px_rgba(217,70,239,0.18)] transition focus:border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="register-confirm-password"
                className="text-xs font-semibold uppercase tracking-[0.4em] text-fuchsia-200"
              >
                Confirm Access Key
              </label>
              <input
                id="register-confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-2xl border border-fuchsia-400/30 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 shadow-[0_0_30px_rgba(217,70,239,0.18)] transition focus:border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-300/60"
              />
            </div>

            {error ? (
              <p className="rounded-xl border border-pink-500/40 bg-pink-500/10 px-4 py-3 text-xs font-medium text-pink-200 shadow-[0_0_30px_rgba(236,72,153,0.25)]">
                {error}
              </p>
            ) : null}

            {status ? (
              <p className="rounded-xl border border-teal-400/60 bg-teal-400/10 px-4 py-3 text-xs font-medium text-teal-200 shadow-[0_0_30px_rgba(45,212,191,0.35)]">
                {status}
              </p>
            ) : null}

            <button type="submit" className={neonButtonClasses} disabled={isSubmitting}>
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-slate-900/60 border-t-transparent" />
                ) : null}
                <span>{isSubmitting ? "Linking" : "Register"}</span>
              </span>
            </button>
          </form>
          <div className="pt-4 text-center">
            <p className="text-xs text-slate-400">
              Already linked?
              {" "}
              <button
                type="button"
                onClick={handleSwitchToLogin}
                className="font-semibold uppercase tracking-[0.3em] text-fuchsia-200 transition hover:text-fuchsia-100"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
