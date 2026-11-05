"use client";

import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { BACKEND_URL } from "@/lib/config";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function SuccessContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const updateSubscription = async () => {
      if (!user) return;

      const sessionId = searchParams.get("session_id");
      const plan = searchParams.get("plan");
      const amount = searchParams.get("amount");

      if (!sessionId || !plan || !amount) {
        if (isMounted) {
          setStatus("error");
          setErrorMessage("Missing payment parameters in URL.");
        }
        return;
      }

      try {
        // 1. Verify the Stripe session via our API route
        const verifyResponse = await fetch('/api/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            plan,
            amount: parseInt(amount, 10)
          })
        });

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok || !verifyData.isValid) {
          if (isMounted) {
            setStatus("error");
            setErrorMessage(verifyData.error || 'Invalid or unverified payment session.');
          }
          return;
        }

        // 2. Safe fullname fallback
        const safeFullname = user.fullName || user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || "User";

        // 3. Update subscription in MongoDB
        const response = await axios.post(`${BACKEND_URL}/api/update-subscription`, {
          userId: user.id,
          fullname: safeFullname,
          email: user.primaryEmailAddress?.emailAddress,
          plan: plan,
          amount: parseInt(amount, 10),
          currency: "usd",
          sessionId: sessionId,
          status: "active",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        });

        if (response.data && isMounted) {
          setStatus("success");
          // Redirect to dashboard after 3.5 seconds
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 3500);
        }
      } catch (error: unknown) {
        console.error("Error updating subscription:", error);
        if (isMounted) {
          setStatus("error");
          let errMsg = "Failed to update subscription in database.";
          if (axios.isAxiosError(error) && error.response?.data) {
            errMsg = error.response.data.error || (typeof error.response.data === 'string' ? error.response.data : errMsg);
          } else if (error instanceof Error) {
            errMsg = error.message;
          }
          setErrorMessage(errMsg);
        }
      }
    };

    updateSubscription();

    return () => {
      isMounted = false;
    };
  }, [user, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-xl">
        {status === "processing" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h1 className="text-2xl font-bold mb-2">Processing Your Payment</h1>
            <p className="text-zinc-400 text-sm">Please wait while we verify your transaction and activate your plan...</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-green-400">Payment Successful!</h1>
            <p className="text-zinc-400 text-sm mb-6">
              Your subscription has been activated in the database. Redirecting to your dashboard...
            </p>
            <Link href="/dashboard" className="w-full">
              <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition cursor-pointer">
                Go to Dashboard Now
              </button>
            </Link>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-red-400">Payment Verification Issue</h1>
            <p className="text-zinc-400 text-sm mb-6">
              {errorMessage || "We could not verify your payment session. If you were charged, please contact support."}
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Link href="/dashboard">
                <button className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition cursor-pointer">
                  Go to Dashboard
                </button>
              </Link>
              <Link href="/#pricing">
                <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition cursor-pointer">
                  Try Again
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center">
        <div className="text-center p-8">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
          <p className="text-zinc-400 text-sm">Please wait while we process your request...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
