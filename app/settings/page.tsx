"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  SidebarCloseIcon,
  SidebarOpenIcon,
  HomeIcon,
  SettingsIcon,
  Check,
  Zap,
  CreditCard,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { loadStripe } from '@stripe/stripe-js';
import { BACKEND_URL } from "@/lib/config";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Organization {
  _id: string;
  admin: string;
  name: string;
  logo: string;
  title: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionData {
  plan: string;
  status: string;
  startDate?: string;
  endDate?: string;
  amount?: number;
}

export default function SettingsPage() {
  const { user } = useUser();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const safeFullname = user.fullName || user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || "User";
        const [orgRes, subRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/admin-organization`, {
            params: { admin: user.fullName || user.username || user.primaryEmailAddress?.emailAddress },
          }),
          axios.post(`${BACKEND_URL}/api/check-subscription`, {
            userId: user.id,
            fullname: safeFullname,
            email: user.primaryEmailAddress?.emailAddress,
          }),
        ]);
        setOrganizations(orgRes.data);
        if (subRes.data) {
          setSubscription(subRes.data);
        }
      } catch (err) {
        console.error("Error fetching settings data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  const handleUpgrade = async (planType: 'standard' | 'pro') => {
    try {
      setCheckoutLoading(planType);
      const endpoint = planType === 'standard' ? '/api/standard' : '/api/pro';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.primaryEmailAddress?.emailAddress,
          userId: user?.id,
        })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      const stripe = await stripePromise;
      if (!stripe) return;
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      console.error("Error initiating upgrade:", err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleDelete = async (orgId: string) => {
    if (confirm("Are you sure you want to delete this organization?")) {
      try {
        await axios.delete(`${BACKEND_URL}/api/delete-organization`, {
          data: { 
            admin: user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress, 
            organizationId: orgId 
          },
        });
        setOrganizations((prev) => prev.filter((org: Organization) => org._id !== orgId));
      } catch (err) {
        console.error("Error deleting organization:", err);
        alert("Failed to delete the organization.");
      }
    }
  };

  const currentPlan = (subscription?.plan || 'Free').toLowerCase();

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-screen bg-zinc-950 text-white">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mr-3" />
        <p>Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-10"
        } h-full bg-zinc-900 pt-16 text-white transition-all duration-300 shadow-lg`}
      >
        <button
          onClick={toggleSidebar}
          className="w-full py-4 px-2 flex text-white rounded-lg transition-all duration-200 justify-end cursor-pointer"
        >
          {sidebarOpen ? (
            <div className="flex justify-between w-full px-2">
              <span className="truncate">{user?.fullName || user?.username || "Account"}</span>
              <SidebarCloseIcon />
            </div>
          ) : (
            <SidebarOpenIcon />
          )}
        </button>

        <hr className="border-zinc-800" />
        <nav className="p-2">
          <ul>
            {sidebarOpen ? (
              <>
                <Link href={'/dashboard'}>
                  <li className="flex items-center space-x-4 p-3 hover:bg-zinc-800 cursor-pointer rounded-lg transition-all duration-200">
                    <HomeIcon className="w-5 h-5 text-zinc-400" />
                    <span>Dashboard</span>
                  </li>
                </Link>
                <Link href={`/settings`}>
                  <li className="flex items-center space-x-4 p-3 bg-zinc-800 text-blue-400 cursor-pointer rounded-lg transition-all duration-200">
                    <SettingsIcon className="w-5 h-5" />
                    <span>Settings & Plan</span>
                  </li>
                </Link>
              </>
            ) : (
              <>
                <Link href={'/dashboard'}>
                  <li className="flex items-center justify-center py-4 hover:bg-zinc-800 cursor-pointer rounded-lg">
                    <HomeIcon className="w-6 h-6" />
                  </li>
                </Link>
                <Link href={`/settings`}>
                  <li className="flex items-center justify-center py-4 bg-zinc-800 text-blue-400 cursor-pointer rounded-lg">
                    <SettingsIcon className="w-6 h-6" />
                  </li>
                </Link>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="flex-1 p-6 md:p-10 bg-zinc-950 text-white pt-20 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">Settings & Subscription</h1>
        <p className="text-zinc-400 mb-8">Manage your plan, limits, and testimonial spaces</p>

        {/* Subscription & Plan Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-10 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-zinc-800 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold capitalize">{subscription?.plan || 'Free'} Plan</h2>
                <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2.5 py-0.5 rounded-full font-medium">
                  {subscription?.status || 'Active'}
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1">
                {currentPlan === 'free' && "Basic testimonial features with 1 organization and watermarks."}
                {currentPlan === 'standard' && "Standard business tier with 3 organizations and no watermark."}
                {currentPlan === 'pro' && "Full access with unlimited organizations and testimonials."}
              </p>
            </div>
            {subscription?.endDate && currentPlan !== 'free' && (
              <div className="text-sm text-zinc-400">
                Renews/Expires: <strong className="text-white">{new Date(subscription.endDate).toLocaleDateString('en-GB')}</strong>
              </div>
            )}
          </div>

          {/* Plan Limits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
              <span className="text-xs text-zinc-400 uppercase tracking-wider">Organizations</span>
              <div className="text-xl font-bold mt-1">
                {organizations.length} / {currentPlan === 'free' ? '1' : currentPlan === 'standard' ? '3' : 'Unlimited'}
              </div>
            </div>
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
              <span className="text-xs text-zinc-400 uppercase tracking-wider">Testimonials</span>
              <div className="text-xl font-bold mt-1">
                {currentPlan === 'free' ? 'Max 50' : 'Unlimited'}
              </div>
            </div>
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
              <span className="text-xs text-zinc-400 uppercase tracking-wider">Watermark</span>
              <div className="text-xl font-bold mt-1 text-blue-400">
                {currentPlan === 'free' ? 'Included' : 'Removed'}
              </div>
            </div>
          </div>

          {/* Upgrade Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {currentPlan === 'free' && (
              <>
                <button
                  onClick={() => handleUpgrade('standard')}
                  disabled={!!checkoutLoading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 shadow"
                >
                  {checkoutLoading === 'standard' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  Upgrade to Standard ($6/mo)
                </button>
                <button
                  onClick={() => handleUpgrade('pro')}
                  disabled={!!checkoutLoading}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 shadow"
                >
                  {checkoutLoading === 'pro' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Upgrade to Pro ($12/mo)
                </button>
              </>
            )}
            {currentPlan === 'standard' && (
              <button
                onClick={() => handleUpgrade('pro')}
                disabled={!!checkoutLoading}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 shadow"
              >
                {checkoutLoading === 'pro' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Upgrade to Pro ($12/mo)
              </button>
            )}
            {currentPlan === 'pro' && (
              <div className="text-sm text-green-400 flex items-center gap-2 py-2">
                <Check className="w-5 h-5" /> You are on the highest tier plan with unlimited organizations.
              </div>
            )}
          </div>
        </div>

        {/* Organizations Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Testimonial Organizations</h2>
          <Link href="/create-organization">
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition cursor-pointer">
              + New Space
            </button>
          </Link>
        </div>

        {organizations.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400">
            No organizations created yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org: Organization) => (
              <div key={org._id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{org.name}</h3>
                      <p className="text-sm text-zinc-400">{org.title}</p>
                    </div>
                    {org.logo ? (
                      <Image
                        src={`data:image/png;base64,${org.logo}`}
                        className="w-10 h-10 rounded-full object-cover"
                        alt="Logo"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400">
                        {org.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-4">
                    Created: {new Date(org.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
                  <Link href={`/organization/${org.name}`}>
                    <button className="px-4 py-1.5 text-sm border rounded-md border-zinc-700 hover:bg-zinc-800 cursor-pointer transition">
                      Manage
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(org._id)}
                    className="px-4 py-1.5 text-sm border rounded-md border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
