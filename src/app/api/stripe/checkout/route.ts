import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, PaidPlan } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { plan, userId } = await req.json();

    if (!plan || !userId) {
      return NextResponse.json({ error: "Missing plan or userId" }, { status: 400 });
    }

    if (!["pro", "business"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const typedPlan = plan as PaidPlan;

    // Fetch account
    const { data: account, error } = await supabase
      .from("iot_accounts")
      .select("id, user_id, plan, stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (error || !account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Get user email
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    const email = userData?.user?.email;

    // Get or create Stripe customer
    let customerId = account.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email || undefined,
        metadata: { userId: account.user_id },
      });
      customerId = customer.id;

      await supabase
        .from("iot_accounts")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", userId);
    }

    // Check for existing active subscription (upgrade/downgrade)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      const existingSub = subscriptions.data[0];
      const planConfig = PLANS[typedPlan];

      let newPriceId = planConfig.priceId;

      if (!newPriceId) {
        const price = await stripe.prices.create({
          currency: "usd",
          product_data: {
            name: `iotpush ${planConfig.name} Plan`,
          },
          unit_amount: planConfig.price,
          recurring: { interval: "month" },
        });
        newPriceId = price.id;
      }

      await stripe.subscriptions.update(existingSub.id, {
        items: [
          {
            id: existingSub.items.data[0].id,
            price: newPriceId,
          },
        ],
        metadata: { userId, plan: typedPlan },
        proration_behavior: "create_prorations",
      });

      await supabase
        .from("iot_accounts")
        .update({ plan: typedPlan })
        .eq("user_id", userId);

      return NextResponse.json({ upgraded: true, plan: typedPlan });
    }

    // Create new checkout session
    const planConfig = PLANS[typedPlan];

    const lineItems = planConfig.priceId
      ? [{ price: planConfig.priceId, quantity: 1 }]
      : [
          {
            price_data: {
              currency: "usd" as const,
              product_data: {
                name: `iotpush ${planConfig.name} Plan`,
                description:
                  typedPlan === "pro"
                    ? "10 topics, 10k pushes/month, private topics, webhooks"
                    : "Unlimited topics, 100k pushes/month, priority support",
              },
              unit_amount: planConfig.price,
              recurring: { interval: "month" as const },
            },
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      success_url: `https://www.iotpush.com/dashboard/billing?success=true`,
      cancel_url: `https://www.iotpush.com/dashboard/billing?canceled=true`,
      metadata: { userId, plan: typedPlan },
      subscription_data: {
        metadata: { userId, plan: typedPlan },
      },
      line_items: lineItems,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
