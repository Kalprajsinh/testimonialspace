"use client";

export const runtime = "edge";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { BACKEND_URL } from "@/lib/config";
import { AlertCircle, Zap, ArrowLeft, Loader2 } from "lucide-react";

export default function NewOrganization() {
  const { user } = useUser();

  const [organame, setOrganame] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [logo, setLogo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [checkingLimit, setCheckingLimit] = useState<boolean>(true);
  const [limitReachedError, setLimitReachedError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  // Check plan limits on mount
  useEffect(() => {
    async function verifyLimits() {
      if (!user) return;
      try {
        const safeFullname = user.fullName || user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || "User";
        const [subRes, orgsRes] = await Promise.all([
          axios.post(`${BACKEND_URL}/api/check-subscription`, {
            userId: user.id,
            fullname: safeFullname,
            email: user.primaryEmailAddress?.emailAddress
          }),
          axios.get(`${BACKEND_URL}/api/admin-organization`, {
            params: { admin: user.fullName || user.username || user.primaryEmailAddress?.emailAddress }
          })
        ]);

        const plan = (subRes.data?.plan || 'Free').toLowerCase();
        const existingCount = orgsRes.data?.length || 0;

        if (plan === 'free' && existingCount >= 1) {
          setLimitReachedError("Free plan allows only 1 organization. Please upgrade to Standard (3 orgs) or Pro (unlimited) to create more.");
        } else if (plan === 'standard' && existingCount >= 3) {
          setLimitReachedError("Standard plan allows up to 3 organizations. Please upgrade to Pro for unlimited organizations.");
        }
      } catch (err) {
        console.error("Error verifying organization limits:", err);
      } finally {
        setCheckingLimit(false);
      }
    }

    verifyLimits();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setLogo(reader.result.split(",")[1]); // Extract base64 string
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (limitReachedError) return;

    setLoading(true);
    setSuccess(null);
    setSubmitError(null);

    try {
      const adminIdentity = user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress;
      await axios.post(`${BACKEND_URL}/api/organization`, {
        admin: adminIdentity,
        name: organame.trim(),
        logo: logo,
        title: title,
        message: message,
      });
      setSuccess("Organization created successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      console.error("Error creating organization:", err);
      let errMsg = "Failed to create organization";
      if (axios.isAxiosError(err) && err.response?.data) {
        errMsg = err.response.data.error || (typeof err.response.data === 'string' ? err.response.data : errMsg);
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      setSubmitError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingLimit) {
    return (
      <div className="min-h-screen bg-zinc-950 pt-24 px-4 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
          <p className="text-zinc-400 text-sm">Checking your plan limits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 px-4 text-white pb-16">
      <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Create a New Organization</h1>
          <p className="text-sm text-zinc-400 mt-1">Set up a space to collect and display testimonials</p>
        </div>

        {limitReachedError && (
          <div className="p-4 bg-red-950/60 border border-red-800 rounded-xl mb-6 text-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Plan Limit Reached</h4>
                <p className="text-sm text-red-300 mt-1">{limitReachedError}</p>
                <div className="mt-4 flex gap-3">
                  <Link href="/#pricing">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition cursor-pointer">
                      <Zap className="w-4 h-4" /> Upgrade Plan
                    </button>
                  </Link>
                  <Link href="/dashboard">
                    <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition cursor-pointer">
                      Back to Dashboard
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {submitError && (
          <div className="p-4 bg-red-950/60 border border-red-800 rounded-xl mb-6 text-red-200 text-sm">
            {submitError}
          </div>
        )}

        {success && (
          <div className="fixed top-20 right-6 z-50 px-4 py-3 rounded-lg bg-green-600 text-white border border-green-500 shadow-lg">
            ✅ Your Organization created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className={limitReachedError ? "opacity-50 pointer-events-none" : ""}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Organization Name:</label>
              <input
                type="text"
                placeholder="Enter Organization name (e.g. Acme Corp)"
                value={organame}
                onChange={(e) => setOrganame(e.target.value)}
                className="w-full p-3 border border-zinc-700 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                required
                disabled={!!limitReachedError}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title for Collecting Testimonials:</label>
              <input
                type="text"
                placeholder="e.g. Would you recommend our product?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-zinc-700 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                required
                disabled={!!limitReachedError}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Upload Logo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-zinc-700 rounded-lg bg-zinc-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-700 file:text-white hover:file:bg-zinc-600 cursor-pointer"
                disabled={!!limitReachedError}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Custom Message / Prompt:</label>
              <textarea
                placeholder="Write a warm note to your customers asking for feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full p-3 border border-zinc-700 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                required
                disabled={!!limitReachedError}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !!limitReachedError}
              className="w-full mt-4 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Creating...
                </>
              ) : (
                "Create Organization"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
