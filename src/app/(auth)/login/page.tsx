"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/actions/auth";

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: "12px",
  fontWeight: 500,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#6B7280",
  marginBottom: "6px",
};

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    height: "46px",
    fontFamily: "var(--font-body)",
    fontSize: "14px",
    borderRadius: "var(--radius)",
    border: `1.5px solid ${hasError ? "var(--destructive)" : "#E5E7EB"}`,
    padding: "0 14px",
    outline: "none",
    backgroundColor: "#F9FAFB",
    color: "var(--foreground)",
    boxSizing: "border-box" as const,
    transition: "all 0.2s ease",
  };
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn(email, password);

    if (result && result.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  function onFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.backgroundColor = "white";
    e.currentTarget.style.borderColor = "var(--primary)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(198,98,62,0.1)";
  }
  function onBlur(hasError: boolean) {
    return (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.backgroundColor = "#F9FAFB";
      e.currentTarget.style.borderColor = hasError
        ? "var(--destructive)"
        : "#E5E7EB";
      e.currentTarget.style.boxShadow = "none";
    };
  }

  return (
    <div>
      {/* Title */}
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "36px",
          fontWeight: 700,
          color: "var(--foreground)",
          letterSpacing: "-0.5px",
          lineHeight: 1.15,
          margin: "0 0 6px",
        }}
      >
        Sign in
      </h1>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          color: "var(--muted)",
          margin: "0 0 32px",
        }}
      >
        Welcome back. Enter your details to continue.
      </p>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {/* Email */}
        <div>
          <label htmlFor="email" style={labelStyle}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            aria-label="Email address"
            placeholder="you@organization.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle(!!error)}
            onFocus={onFocus}
            onBlur={onBlur(!!error)}
          />
        </div>

        {/* Password */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <label
              htmlFor="password"
              style={{ ...labelStyle, marginBottom: 0 }}
            >
              Password
            </label>
            <Link
              href="/reset-password"
              className="transition-colors duration-200 hover:text-[var(--primary)]"
              style={{
                fontSize: "12px",
                color: "var(--muted)",
                textDecoration: "none",
                fontFamily: "var(--font-body)",
              }}
            >
              Forgot password?
            </Link>
          </div>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              aria-label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputStyle(!!error), paddingRight: "44px" }}
              onFocus={onFocus}
              onBlur={onBlur(!!error)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9CA3AF",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              {showPassword ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p
            role="alert"
            style={{
              margin: 0,
              fontSize: "13px",
              color: "var(--destructive)",
              fontFamily: "var(--font-body)",
            }}
          >
            {error}
          </p>
        )}

        {/* CTA */}
        <button
          type="submit"
          disabled={loading}
          className="hover:opacity-80 transition-opacity duration-200"
          style={{
            width: "100%",
            height: "48px",
            marginTop: "8px",
            backgroundColor: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius)",
            fontFamily: "var(--font-heading)",
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "0.01em",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Signing in..." : "Sign in →"}
        </button>
      </form>

      {/* Sign up prompt */}
      <p
        style={{
          margin: "28px 0 0",
          textAlign: "center",
          fontSize: "14px",
          color: "var(--muted)",
          fontFamily: "var(--font-body)",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold hover:underline transition-colors duration-200"
          style={{ color: "var(--primary)", textDecoration: "none" }}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
