"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Catalog" },
  { href: "/mis-loans", label: "Active Loans" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/history", label: "History" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-cyan-500/20 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-[0.3em] text-cyan-400">
          PAGEFLIP
        </Link>
        <nav className="hidden gap-6 text-sm uppercase text-slate-300 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-cyan-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="rounded-md border border-cyan-500/40 px-3 py-1 text-xs uppercase tracking-widest text-cyan-200 shadow-[0_0_15px_rgba(45,212,191,0.35)] md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          Menu
        </button>
        <div className="hidden items-center gap-3 md:flex">
          {/* TODO: Replace with authenticated user menu */}
          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
            User Menu
          </span>
        </div>
      </div>
      {isMenuOpen ? (
        <div className="space-y-2 border-t border-cyan-500/20 px-6 py-4 text-sm uppercase text-slate-300 md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block">
              {link.label}
            </Link>
          ))}
          {/* TODO: Expand with auth-aware quick actions */}
        </div>
      ) : null}
    </header>
  );
}
