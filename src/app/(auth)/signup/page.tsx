"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { getSignupEmailDeliveryIssue } from "@/app/actions/email";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const normalizedEmail = form.email.trim().toLowerCase();
    let deliveryIssue: string | null = null;

    try {
      deliveryIssue = await getSignupEmailDeliveryIssue(normalizedEmail);
    } catch (error) {
      setLoading(false);
      toast.error(
        error instanceof Error
          ? error.message
          : "Email delivery is not configured correctly.",
        { duration: 9000 }
      );
      return;
    }

    if (deliveryIssue) {
      setLoading(false);
      toast.error(deliveryIssue, { duration: 9000 });
      return;
    }

    const { error } = await signUp.email({
      name: form.name.trim(),
      email: normalizedEmail,
      password: form.password,
      callbackURL: "/",
    });

    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Sign up failed. Please try again.");
      return;
    }

    toast.success("Account created! Check your email to verify.");
    router.push("/verify-email?email=" + encodeURIComponent(normalizedEmail));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Create your account</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Start your learning journey today</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Alex Johnson"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          leftIcon={<User className="h-4 w-4" />}
          autoComplete="name"
        />
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
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            leftIcon={<Lock className="h-4 w-4" />}
            autoComplete="new-password"
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

        <Button type="submit" className="w-full mt-2" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-violet-600 hover:text-violet-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
