import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifySSOToken } from "@/lib/sso";

/**
 * POST /api/auth/sso/exchange
 * 
 * Exchange an SSO relay token for a local session.
 * Called by the /auth/sso page after receiving a token.
 * 
 * Body: { "token": "eyJ..." }
 * Returns: { "session_token": "...", "user": { ... } }
 */
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Verify the SSO token
    const payload = await verifySSOToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired SSO token" }, { status: 401 });
    }

    // Verify this token is intended for this product
    const thisProduct = process.env.SSO_PRODUCT_ID || "iotpush";
    if (payload.target !== thisProduct) {
      return NextResponse.json(
        { error: `Token not intended for ${thisProduct}` },
        { status: 403 }
      );
    }

    // Use admin client to find or create user
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    // Check if user exists by email
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === payload.email);

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create user with a random password (they'll use SSO to login)
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: payload.email,
        email_confirm: true,
        user_metadata: {
          full_name: payload.name,
          sso_source: payload.source,
        },
      });

      if (createError || !newUser.user) {
        console.error("[SSO] Failed to create user:", createError);
        return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
      }

      userId = newUser.user.id;
    }

    // Generate a magic link / session for the user
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: payload.email,
    });

    if (linkError || !linkData) {
      console.error("[SSO] Failed to generate session link:", linkError);
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    // Extract the token from the magic link
    const linkUrl = new URL(linkData.properties.action_link);
    const hashed_token = linkData.properties.hashed_token;

    return NextResponse.json({
      ok: true,
      // Return the verification token that the client will use via verifyOtp
      email: payload.email,
      token_hash: hashed_token,
      user: {
        id: userId,
        email: payload.email,
        name: payload.name,
        sso_source: payload.source,
      },
    });
  } catch (err) {
    console.error("[SSO] Exchange error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
