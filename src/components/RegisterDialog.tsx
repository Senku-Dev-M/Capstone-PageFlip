"use client";

// TODO: Replace placeholder dialog with shadcn/ui implementation.

export default function RegisterDialog() {
  return (
    <div className="rounded-xl border border-fuchsia-500/30 bg-slate-950/80 p-6 text-slate-200 shadow-[0_0_25px_rgba(217,70,239,0.35)]">
      <h2 className="text-xl font-semibold text-fuchsia-300">Create Account</h2>
      <p className="mt-2 text-sm text-slate-400">
        Registration flows, form validation, and social auth providers will be powered by
        shadcn/ui components here.
      </p>
      {/* TODO: Hook up Firebase auth createUserWithEmailAndPassword */}
    </div>
  );
}
