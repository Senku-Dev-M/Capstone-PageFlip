import type { Metadata } from "next";
import "../styles/globals.css";
import Header from "../components/Header";

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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-slate-100">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 px-6 py-10">
            {/* TODO: Wire up layout-level providers and global UI here */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
