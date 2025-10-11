import type { Metadata } from "next";
import "../styles/globals.css";
import Header from "@/shared/components/Header";

import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "PageFlip Digital Library",
  description: "A dark cyberpunk-inspired digital library experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={styles.appShell}>
          <Header />
          <main className={styles.main}>
            {/* TODO: Wire up layout-level providers and global UI here */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
