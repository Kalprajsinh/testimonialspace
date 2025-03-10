"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-white">
      <h1 className="text-xl font-bold">
        <Link href="/">MyApp</Link>
      </h1>
      <nav>
        {isSignedIn ? (
          <div className="flex items-center gap-4">
            <UserButton showName />
          </div>
        ) : (
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <button className="text-black rounded font-bold cursor-pointer">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-black rounded font-bold cursor-pointer">Sign Up</button>
            </SignUpButton>
          </div>
        )}
      </nav>
    </header>
  );
}
