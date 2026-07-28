"use client";

import Link from "next/link";
import { UserButton, useUser, useAuth } from "@clerk/nextjs";
import { GitBranch, LayoutDashboard, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Insights" },
  { href: "/#about", label: "Workflow" },
];

export default function Navbar() {
  const { user } = useUser();
  const { userId } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-lg font-extrabold text-white sm:text-xl"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-400 text-slate-950 shadow-sm shadow-teal-950/30">
            <Sparkles size={18} aria-hidden="true" />
          </span>
          <span className="truncate">
            Career<span className="text-teal-300">Pilot</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="https://github.com/"
            target="_blank"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Open CareerPilot on GitHub"
          >
            <GitBranch size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {userId ? (
            <>
              <Link
                href="/dashboard"
                className="hidden items-center gap-2 rounded-md bg-teal-400 px-3 py-2 text-sm font-black text-slate-950 shadow-sm shadow-teal-950/30 transition hover:bg-teal-300 sm:inline-flex"
              >
                <LayoutDashboard size={16} aria-hidden="true" />
                Dashboard
              </Link>

              <div className="hidden text-right lg:block">
                <p className="text-xs font-medium text-slate-500">Signed in as</p>
                <p className="max-w-32 truncate text-sm font-semibold text-slate-200">
                  {user?.firstName ?? "User"}
                </p>
              </div>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </>
          ) : (
            <Link
              href="/sign-in"
              className="min-w-16 whitespace-nowrap rounded-md bg-teal-400 px-3 py-2 text-center text-sm font-black text-slate-950 shadow-sm shadow-teal-950/30 transition hover:bg-teal-300 sm:px-4"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.07] text-slate-200 transition hover:bg-white/10 md:hidden"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Menu size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}

            {userId && (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="mt-1 inline-flex items-center gap-2 rounded-md bg-teal-400 px-3 py-2 text-sm font-black text-slate-950"
              >
                <LayoutDashboard size={16} aria-hidden="true" />
                Dashboard
              </Link>
            )}

            <Link
              href="https://github.com/"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <GitBranch size={16} aria-hidden="true" />
              GitHub
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
