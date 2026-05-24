"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { sanitizeCallbackUrl } from "@/lib/routes";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = sanitizeCallbackUrl(searchParams.get("callbackUrl"));
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const { error } = await signIn.email({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      callbackURL: callbackUrl,
    });

    setLoading(false);

    if (error) {
      if (error.message?.toLowerCase().includes("verify")) {
        toast.error("Please verify your email before signing in.");
      } else {
        toast.error("Invalid email or password.");
      }
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Welcome back</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Sign in to continue learning</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="alex@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          leftIcon={<Mail className="h-4 w-4" />}
          autoComplete="email"
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            leftIcon={<Lock className="h-4 w-4" />}
            autoComplete="current-password"
          />
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex justify-end -mt-1">
          <Link href="/forgot-password" className="text-xs text-violet-600 hover:text-violet-700 font-medium">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-violet-600 hover:text-violet-700">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
