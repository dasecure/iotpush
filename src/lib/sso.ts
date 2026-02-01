import { SignJWT, jwtVerify } from "jose";

const SSO_SECRET = new TextEncoder().encode(
  process.env.DASECURE_SSO_SECRET || "dasecure-sso-change-me-in-production"
);

const SSO_ISSUER = "dasecure-sso";
const SSO_TOKEN_EXPIRY = "5m"; // Short-lived relay token

export interface SSOPayload {
  sub: string;       // user ID
  email: string;
  name?: string;
  source: string;    // originating product (passqr, iotpush, waitlistwin)
  target: string;    // destination product
}

/**
 * Generate a short-lived SSO relay token.
 * User clicks "Open iotpush" on PassQR → generates token → redirects.
 */
export async function generateSSOToken(payload: SSOPayload): Promise<string> {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    source: payload.source,
    target: payload.target,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(SSO_ISSUER)
    .setSubject(payload.sub)
    .setExpirationTime(SSO_TOKEN_EXPIRY)
    .sign(SSO_SECRET);
}

/**
 * Verify an incoming SSO relay token.
 */
export async function verifySSOToken(token: string): Promise<SSOPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SSO_SECRET, {
      issuer: SSO_ISSUER,
    });

    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: payload.name as string | undefined,
      source: payload.source as string,
      target: payload.target as string,
    };
  } catch (err) {
    console.error("[SSO] Token verification failed:", err);
    return null;
  }
}

/**
 * Product URLs for SSO redirects.
 */
export const SSO_PRODUCTS: Record<string, { name: string; url: string; color: string }> = {
  passqr: {
    name: "PassQR",
    url: process.env.NEXT_PUBLIC_PASSQR_URL || "https://www.passqr.com",
    color: "#3b82f6",
  },
  iotpush: {
    name: "iotpush",
    url: process.env.NEXT_PUBLIC_IOTPUSH_URL || "https://www.iotpush.com",
    color: "#f97316",
  },
  waitlistwin: {
    name: "WaitlistWin",
    url: process.env.NEXT_PUBLIC_WAITLISTWIN_URL || "https://www.waitlistwin.com",
    color: "#8b5cf6",
  },
  sensestamp: {
    name: "SenseStamp",
    url: process.env.NEXT_PUBLIC_SENSESTAMP_URL || "https://www.sensestamp.com",
    color: "#10b981",
  },
};
