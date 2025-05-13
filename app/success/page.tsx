"use client";

import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

function SuccessContent() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const updateSubscription = async () => {
      if (!user) return;

      const sessionId = searchParams.get("session_id");
      const plan = searchParams.get("plan");
      const amount = searchParams.get("amount");

      if (!sessionId || !plan || !amount) {
        setStatus("error");
        return;
      }

      try {
        // First verify the Stripe session
        const verifyResponse = await fetch('/api/verify-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            plan,
            amount: parseInt(amount)
          })
        });

        if (!verifyResponse.ok) {
          throw new Error('Invalid payment session');
        }

        const { isValid } = await verifyResponse.json();
        
        if (!isValid) {
          setStatus("error");
          return;
        }

        // If session is valid, update subscription
        const response = await axios.post("https://testimonialspace-63bp.vercel.app/api/update-subscription", {
          userId: user.id,
          fullname: user.fullName || user.username,
          email: user.primaryEmailAddress?.emailAddress,
          plan: plan,
          amount: parseInt(amount),
          currency: "usd",
          sessionId: sessionId,
          status: "active",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        });

        if (response.data) {
          setStatus("success");
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            window.location.href = "/";
          }, 3500);
        }
      } catch (error) {
        console.error("Error updating subscription:", error);
        setStatus("error");
      }
    };

    updateSubscription();
  }, [user, searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center">
      <div className="text-center p-8">
        {status === "processing" && (
          <>
            <h1 className="text-3xl font-bold mb-4">Processing Your Payment</h1>
            <p className="text-gray-400">Please wait while we verify your payment...</p>
          </>
        )}
        {status === "success" && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-green-500">Payment Successful!</h1>
            <p className="text-gray-400">Your subscription has been updated. Redirecting to dashboard...</p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-red-500">Invalid Payment Session</h1>
            <p className="text-gray-400">Please make sure you completed the payment process correctly.</p>
          </>
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
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-400">Please wait while we process your request...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
  