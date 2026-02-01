import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { generateSSOToken, SSO_PRODUCTS } from "@/lib/sso";

export async function POST(req: NextRequest) {
  try {
    const { target } = await req.json();

    if (!target || !SSO_PRODUCTS[target]) {
      return NextResponse.json({ error: "Invalid target product" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              try { cookieStore.set(name, value, options); } catch {}
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const token = await generateSSOToken({
      sub: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      source: "iotpush",
      target,
    });

    const targetUrl = `${SSO_PRODUCTS[target].url}/auth/sso?token=${encodeURIComponent(token)}`;

    return NextResponse.json({ url: targetUrl, token });
  } catch (err) {
    console.error("[SSO] Generate error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
