"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { sendVerificationEmail } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";

function VerifyContent() {
  const params = useSearchParams();
  const email = params.get("email") ?? "your email";
  const canResend = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    const { error } = await sendVerificationEmail({
      email,
      callbackURL: "/",
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Could not resend verification email.");
      return;
    }

    toast.success("Verification email sent.");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 border border-violet-200">
          <Mail className="h-8 w-8 text-violet-600" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">Check your inbox</h2>
      <p className="text-sm text-slate-500 mb-2">We sent a verification link to</p>
      <p className="font-semibold text-slate-800 mb-6">{email}</p>
      <p className="text-xs text-slate-400 mb-6">
        Click the link in the email to activate your account. Check your spam folder if you don&apos;t see it.
      </p>
      <div className="space-y-3">
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          loading={loading}
          disabled={!canResend}
          onClick={handleResend}
        >
          Resend email
        </Button>
        <Link href="/login" className="block text-sm font-semibold text-violet-600 hover:text-violet-700">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
