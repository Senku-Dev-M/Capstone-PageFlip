"use client";

import styles from "./Toast.module.css";

export type ToastProps = {
  message: string;
  variant?: "success" | "error" | "info";
};

const variantStyles: Record<Required<ToastProps>["variant"], string> = {
  success: styles.success,
  error: styles.error,
  info: styles.info,
};

export default function Toast({ message, variant = "info" }: ToastProps) {
  return (
    <div
      role="status"
      className={`${styles.toast} ${variantStyles[variant]}`}
    >
      {/* TODO: Replace with shadcn/ui toast primitives and animations */}
      {message}
    </div>
  );
}
