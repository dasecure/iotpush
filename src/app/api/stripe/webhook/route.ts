import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          await supabase
            .from("iot_accounts")
            .update({
              plan,
              stripe_customer_id: session.customer as string,
            })
            .eq("user_id", userId);

          console.log(`✅ User ${userId} upgraded to ${plan}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId && subscription.status === "active") {
          const plan = subscription.metadata?.plan;
          if (plan) {
            await supabase
              .from("iot_accounts")
              .update({ plan })
              .eq("user_id", userId);

            console.log(`✅ User ${userId} subscription updated to ${plan}`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await supabase
            .from("iot_accounts")
            .update({ plan: "free" })
            .eq("user_id", userId);

          console.log(`✅ User ${userId} downgraded to free`);
        } else {
          // Fallback: find by customer ID
          const customerId = subscription.customer as string;
          const { data } = await supabase
            .from("iot_accounts")
            .select("user_id")
            .eq("stripe_customer_id", customerId)
            .single();

          if (data) {
            await supabase
              .from("iot_accounts")
              .update({ plan: "free" })
              .eq("user_id", data.user_id);

            console.log(`✅ User ${data.user_id} downgraded to free via customer lookup`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
