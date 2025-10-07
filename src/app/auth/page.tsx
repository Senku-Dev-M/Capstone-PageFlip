import LoginDialog from "@/components/LoginDialog";
import RegisterDialog from "@/components/RegisterDialog";

export const metadata = {
  title: "Authentication Preview",
};

export default function AuthPreviewPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 overflow-hidden bg-slate-950 px-6 py-16 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-16 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.08),_transparent_55%)]" />
      </div>

      <div className="relative z-10 text-center space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.6em] text-teal-300/80">PageFlip Access Grid</p>
        <h1 className="text-4xl font-semibold text-slate-50">Authentication Modules</h1>
        <p className="max-w-xl text-sm text-slate-400">
          Launch the neon terminals below to connect with Firebase Authentication. These dialogs showcase the cyberpunk styling used across the PageFlip experience.
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row">
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-teal-500/30 bg-slate-950/80 p-6 shadow-[0_0_45px_rgba(45,212,191,0.2)]">
          <p className="text-xs uppercase tracking-[0.45em] text-teal-200/80">Existing Operatives</p>
          <LoginDialog />
        </div>
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-fuchsia-500/30 bg-slate-950/80 p-6 shadow-[0_0_45px_rgba(217,70,239,0.2)]">
          <p className="text-xs uppercase tracking-[0.45em] text-fuchsia-200/80">New Recruits</p>
          <RegisterDialog />
        </div>
      </div>
    </main>
  );
}
