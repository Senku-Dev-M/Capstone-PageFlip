"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Catalog", requiresAuth: false },
  { href: "/loans", label: "My Loans", requiresAuth: true },
  { href: "/wishlist", label: "Wishlist", requiresAuth: true },
  { href: "/history", label: "History", requiresAuth: true },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = true;
  const username = "NeoReader";

  const filteredLinks = navLinks.filter(
    (link) => !link.requiresAuth || isLoggedIn,
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-700/50 bg-gray-900/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-teal-400">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-teal-400/40 bg-teal-500/10 shadow-[0_0_12px_rgba(20,184,166,0.35)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.75 5.75h8.5a3 3 0 0 1 3 3v9.5l-3.25-2.167L9.75 18.25l-3.25-2.167L3.25 18.25v-9.5a3 3 0 0 1 3-3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.75 5.75H19a1.75 1.75 0 0 1 1.75 1.75v10.75l-2.5-1.667-1.5 1"
              />
            </svg>
          </span>
          <span className="text-xl font-semibold tracking-[0.3em] text-teal-400 text-glow">
            PageFlip
          </span>
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium uppercase text-gray-300 md:flex">
          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-200 hover:text-teal-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-4 md:flex">
          {isLoggedIn ? (
            <>
              <span className="text-gray-300 font-semibold">{username}</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-500/60 bg-gray-900/80 shadow-[0_0_10px_rgba(20,184,166,0.35)]">
                <span className="h-6 w-6 rounded-full bg-gradient-to-br from-teal-400/40 via-transparent to-teal-500/20"></span>
              </span>
              <button
                type="button"
                className="text-gray-400 transition-colors duration-200 hover:text-pink-500"
                aria-label="Log out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 8.25V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25v-3"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9l3 3-3 3m6-3H9"
                  />
                </svg>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-[0_0_10px_rgba(20,184,166,0.5)] hover:bg-teal-600 hover:shadow-[0_0_15px_rgba(20,184,166,0.8)] transition"
            >
              Log In
            </Link>
          )}
        </div>
        <button
          type="button"
          className="ml-auto inline-flex items-center justify-center rounded-md border border-teal-500/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-teal-200 shadow-[0_0_12px_rgba(20,184,166,0.35)] transition hover:border-teal-400 hover:text-teal-100 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {isMenuOpen ? (
        <div
          id="mobile-nav"
          className="space-y-4 border-t border-gray-700/50 px-6 py-5 text-sm font-medium uppercase text-gray-300 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md border border-transparent px-3 py-2 transition hover:border-teal-500/40 hover:text-teal-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700/60 to-transparent" />
          {isLoggedIn ? (
            <div className="flex items-center justify-between gap-4 rounded-lg border border-teal-500/30 bg-gray-900/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-500/60 bg-gray-900/80 shadow-[0_0_10px_rgba(20,184,166,0.35)]">
                  <span className="h-6 w-6 rounded-full bg-gradient-to-br from-teal-400/40 via-transparent to-teal-500/20"></span>
                </span>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Logged in as</span>
                  <span className="text-sm font-semibold text-gray-200">{username}</span>
                </div>
              </div>
              <button
                type="button"
                className="text-gray-400 transition-colors duration-200 hover:text-pink-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 8.25V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25v-3"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9l3 3-3 3m6-3H9"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center bg-teal-500 text-white px-4 py-3 rounded-md text-sm font-semibold shadow-[0_0_10px_rgba(20,184,166,0.5)] transition hover:bg-teal-600 hover:shadow-[0_0_15px_rgba(20,184,166,0.8)]"
            >
              Log In
            </Link>
          )}
        </div>
      ) : null}
    </header>
  );
}
