"use client";

export const runtime = "edge";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Star } from "lucide-react";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

export default function Header() {
  const { isSignedIn, user } = useUser();
  const router = usePathname();
  const [plan, setPlan] = useState<string>("Free");

  useEffect(() => {
    let isMounted = true;
    const fetchSubscription = async () => {
      if (user?.primaryEmailAddress?.emailAddress) {
        try {
          const safeFullname = user.fullName || user.username || user.primaryEmailAddress.emailAddress.split('@')[0] || "User";
          const response = await axios.post(`${BACKEND_URL}/api/check-subscription`, {
            userId: user.id,
            fullname: safeFullname,
            email: user.primaryEmailAddress.emailAddress
          });
          if (isMounted && response.data?.plan) {
            setPlan(response.data.plan);
          }
        } catch (error) {
          console.error("Error fetching subscription:", error);
        }
      }
    };

    if (isSignedIn) {
      fetchSubscription();
    }

    return () => {
      isMounted = false;
    };
  }, [isSignedIn, user]);

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const formattedPlan = plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-zinc-800 text-white fixed w-full z-20">
      <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
        <Star size={24} className="fill-blue-400 text-blue-600" />
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
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/settings" title="View Plan & Subscription">
              <span className={`text-xs sm:text-sm font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full cursor-pointer transition ${
                plan.toLowerCase() === 'pro' 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : plan.toLowerCase() === 'standard' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                    : 'bg-zinc-700 text-zinc-300'
              }`}>
                {formattedPlan} Plan
              </span>
            </Link>
            <Link href="/dashboard" className="hidden sm:block text-sm text-zinc-300 hover:text-white">
              Dashboard
            </Link>
            <div className="hidden sm:block">
              <UserButton showName />
            </div>
            <div className="block sm:hidden">
              <UserButton showName={false} />
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <button className="rounded font-bold cursor-pointer">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold cursor-pointer">Sign Up</button>
            </SignUpButton>
          </div>
        )}
      </nav>
    </header>
  );
}
