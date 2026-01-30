import { redirect } from "next/navigation";
import { createServerSupabaseClient as createServerClient } from "@/lib/supabase-server";
import BillingClient from "./billing-client";

export default async function BillingPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch account info
  const { data: account } = await supabase
    .from("iot_accounts")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // If no account exists yet, create one
  if (!account) {
    const { createAdminClient } = await import("@/lib/supabase-admin");
    const admin = createAdminClient();
    await admin.from("iot_accounts").insert({ user_id: user.id });
  }

  const plan = account?.plan || "free";
  const pushesUsed = account?.pushes_used || 0;
  const pushesResetAt = account?.pushes_reset_at || new Date().toISOString();

  return (
    <BillingClient
      userId={user.id}
      email={user.email || ""}
      plan={plan}
      pushesUsed={pushesUsed}
      pushesResetAt={pushesResetAt}
      hasStripeCustomer={!!account?.stripe_customer_id}
    />
  );
}
