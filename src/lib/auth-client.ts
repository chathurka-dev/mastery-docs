import { createAuthClient } from "better-auth/react";
import { getPublicAuthBaseUrl } from "@/lib/public-env";

export const authClient = createAuthClient({
  baseURL: getPublicAuthBaseUrl(),
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  sendVerificationEmail,
  requestPasswordReset,
  resetPassword,
} = authClient;
