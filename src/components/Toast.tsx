"use client";

export type ToastProps = {
  message: string;
  variant?: "success" | "error" | "info";
};

const variantStyles: Record<Required<ToastProps>["variant"], string> = {
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  error: "border-rose-500/40 bg-rose-500/10 text-rose-200",
  info: "border-cyan-500/40 bg-cyan-500/10 text-cyan-200",
};

export default function Toast({ message, variant = "info" }: ToastProps) {
  return (
    <div
      role="status"
      className={`rounded-lg border px-4 py-3 text-sm shadow-[0_0_20px_rgba(56,189,248,0.15)] ${variantStyles[variant]}`}
    >
      {/* TODO: Replace with shadcn/ui toast primitives and animations */}
      {message}
    </div>
  );
}
