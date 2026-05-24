"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import { resetPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function ResetContent() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    const { error } = await resetPassword({ newPassword: password });
    setLoading(false);
    if (error) { toast.error(error.message ?? "Reset failed"); return; }
    toast.success("Password reset! You can now sign in.");
    router.push("/login");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Set new password</h2>
      <p className="text-sm text-slate-500 mb-6">Choose a strong password for your account.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          autoComplete="new-password"
        />
        <Button type="submit" className="w-full" loading={loading}>
          Reset password
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetContent /></Suspense>;
}
