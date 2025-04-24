"use client";

export const runtime = "edge";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Star } from "lucide-react";
import { usePathname  } from 'next/navigation';

export default function Header() {
  const { isSignedIn } = useUser();
  const router = usePathname();

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-zinc-800 text-white fixed w-full z-20">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Star size={24} className="fill-blue-400 text-blue-600"/>
        <Link href="/">Testimonial Space</Link>
      </h1>
      {router === '/' && (
        <nav className="hidden md:flex gap-6 mr-16">
        <a href="#features" className="text-sm font-medium hover:underline underline-offset-4" onClick={(e) => scrollToSection(e, '#features')}>Features</a>
        <a href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4" onClick={(e) => scrollToSection(e, '#how-it-works')}>How It Works</a>
        <a href="#pricing" className="text-sm font-medium hover:underline underline-offset-4" onClick={(e) => scrollToSection(e, '#pricing')}>Pricing</a>
        <a href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4" onClick={(e) => scrollToSection(e, '#testimonials')}>Testimonials</a>
      </nav>
      )}
      <nav>
        {isSignedIn ? (
          <div className="flex items-center gap-2">
            <UserButton showName/>
          </div>
        ) : (
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <button className="rounded font-bold cursor-pointer">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded font-bold cursor-pointer">Sign Up</button>
            </SignUpButton>
          </div>
        )}
      </nav>
    </header>
  );
}
