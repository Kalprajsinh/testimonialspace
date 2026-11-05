import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Canceled</h1>
        <p className="text-zinc-400 mb-6 text-sm">
          Your payment was not completed and you have not been charged. You can upgrade anytime.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/#pricing">
            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition cursor-pointer">
              View Plans Again
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium transition cursor-pointer flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
