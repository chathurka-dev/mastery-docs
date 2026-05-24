"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { requestPasswordReset } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await requestPasswordReset({ email: email.trim().toLowerCase(), redirectTo: "/reset-password" });
    setLoading(false);
    setSent(true);
    toast.success("Reset link sent if that email exists.");
  };

  if (sent) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200">
            <Mail className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Check your email</h2>
        <p className="text-sm text-slate-500 mb-6">
          If <strong>{email}</strong> is registered, you&apos;ll receive a reset link shortly.
        </p>
        <Link href="/login" className="text-sm font-semibold text-violet-600 hover:text-violet-700">
          Back to sign in →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Reset your password</h2>
      <p className="text-sm text-slate-500 mb-6">Enter your email and we&apos;ll send you a reset link.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="alex@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
          autoComplete="email"
        />
        <Button type="submit" className="w-full" loading={loading} disabled={!email.trim()}>
          Send reset link
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
