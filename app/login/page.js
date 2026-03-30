"use client";

/**
 * Login page — shows a Google Sign-In button.
 *
 * This page appears when an unauthenticated user tries to access
 * the dashboard. After clicking "Sign in with Google", they're
 * redirected back to the dashboard.
 */

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f1117 0%, #1a1d27 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#e2e8f0",
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "#1a1d27",
          border: "1px solid #2e3349",
          borderRadius: "16px",
          padding: "48px 40px",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "8px",
            background: "linear-gradient(90deg, #4f7cff, #7c5cff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          YAI / VM Group
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#8892a4",
            marginBottom: "32px",
          }}
        >
          Weekly Operations Monitor
        </p>

        {/* Error message */}
        {error === "AccessDenied" && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "24px",
              fontSize: "13px",
              color: "#ef4444",
            }}
          >
            Access denied. Your Google account is not authorized to view this
            dashboard. Contact Tomer for access.
          </div>
        )}

        {/* Sign in button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            width: "100%",
            padding: "14px 24px",
            background: "#ffffff",
            color: "#333333",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "box-shadow 0.2s",
          }}
          onMouseOver={(e) =>
            (e.target.style.boxShadow = "0 4px 12px rgba(79,124,255,0.3)")
          }
          onMouseOut={(e) => (e.target.style.boxShadow = "none")}
        >
          {/* Google "G" icon (inline SVG) */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        <p
          style={{
            marginTop: "24px",
            fontSize: "12px",
            color: "#555",
          }}
        >
          Only authorized VM Group team members can access this dashboard.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "#0f1117",
            color: "#8892a4",
          }}
        >
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
