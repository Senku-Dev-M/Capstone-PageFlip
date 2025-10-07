"use client";

// TODO: Replace placeholder dialog with shadcn/ui implementation.

export default function LoginDialog() {
  return (
    <div className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-6 text-slate-200 shadow-[0_0_25px_rgba(34,211,238,0.35)]">
      <h2 className="text-xl font-semibold text-cyan-300">Login</h2>
      <p className="mt-2 text-sm text-slate-400">
        Authentication fields and actions will live inside the shadcn/ui dialog.
      </p>
      {/* TODO: Hook up Firebase authentication inputs */}
    </div>
  );
}
