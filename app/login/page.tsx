"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/experience",
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid username or password.");
    } else if (result?.url) {
      window.location.href = result.url;
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#475569]">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[891px] flex-col gap-[17px] rounded-[8px] bg-white"
      >
        {/* GT Gold accent bar */}
        <div className="h-[26px] w-full rounded-t-[8px] bg-gt-gold" />

        {/* Header */}
        <div className="flex items-center px-[10px]">
          <h1 className="font-[family-name:Arial,sans-serif] text-[18px] font-bold leading-[20px] text-[#1e293b]">
            Sign in to your account
          </h1>
        </div>

        {/* Inputs + Sign In button */}
        <div className="flex flex-col gap-[18px] px-[10px] pb-[20px]">
          <div className="flex items-start gap-[17px]">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-[28px] w-[204px] rounded-[4px] border border-[#a3acb9] bg-white px-[8px] font-[family-name:Arial,sans-serif] text-[13px] text-[#697386] shadow-[0_1px_2px_rgba(55,65,81,0.08)] outline-none focus:border-[#0284c7] focus:text-[#0f172a]"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-[28px] w-[204px] rounded-[4px] border border-[#a3acb9] bg-white px-[8px] font-[family-name:Arial,sans-serif] text-[13px] text-[#697386] shadow-[0_1px_2px_rgba(55,65,81,0.08)] outline-none focus:border-[#0284c7] focus:text-[#0f172a]"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex h-[30px] w-[83px] items-center justify-center rounded-full bg-[#0284c7] font-[family-name:Arial,sans-serif] text-[10px] font-bold text-[#f8fafc] transition-colors hover:bg-[#0369a1] disabled:opacity-50"
            >
              {loading ? "..." : "Sign In"}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="font-[family-name:Arial,sans-serif] text-[12px] text-[#900b09]">
              {error}
            </p>
          )}

          {/* Remember me */}
          <label className="flex items-center gap-[3px] cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-[10px] w-[11px] rounded-[2px] border border-[#475569] bg-white accent-[#475569]"
            />
            <span className="font-[family-name:Arial,sans-serif] text-[12px] leading-[20px] text-[#0f172a]">
              Remember me on this computer
            </span>
          </label>

          {/* Forgot links */}
          <div className="flex items-center">
            <p className="font-[family-name:Arial,sans-serif] text-[12px] text-[#0f172a]">
              Forgot{" "}
              <a href="#" className="text-[#0284c7] underline">
                Username
              </a>{" "}
              or{" "}
              <a href="#" className="text-[#0284c7] underline">
                Password
              </a>
              ?
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
