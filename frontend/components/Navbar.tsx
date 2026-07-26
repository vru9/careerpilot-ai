"use client";

import Link from "next/link";
import { UserButton, useUser, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const { user } = useUser();
  const { userId } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold tracking-tight">
          <span className="text-blue-500">Career</span>
          <span className="text-white">Pilot</span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-gray-300 transition hover:text-blue-400"
          >
            Home
          </Link>

          <Link
            href="/#features"
            className="text-gray-300 transition hover:text-blue-400"
          >
            Features
          </Link>

          <Link
            href="/#about"
            className="text-gray-300 transition hover:text-blue-400"
          >
            About
          </Link>

          <Link
            href="https://github.com/"
            target="_blank"
            className="text-gray-300 transition hover:text-blue-400"
          >
            GitHub
          </Link>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {userId ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm text-gray-400">Welcome back</p>
                <p className="font-semibold text-white">
                  {user?.firstName ?? "User"} 👋
                </p>
              </div>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}