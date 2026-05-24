"use server";

import { getEmailDeliveryIssue } from "@/lib/email";

export async function getSignupEmailDeliveryIssue(email: string) {
  return getEmailDeliveryIssue(email);
}
