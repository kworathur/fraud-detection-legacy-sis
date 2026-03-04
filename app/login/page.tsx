"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div
      className="flex h-screen w-full justify-center pt-[152px]"
      style={{
        backgroundImage: "url('/images/login-bg.png')",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="flex h-fit w-full max-w-[1024px] flex-col rounded-lg bg-white">
        <div className="h-[86px] w-full rounded-t-lg" />
        <div className="h-[29px] w-full bg-gt-gold" />

        <div className="flex items-center px-[10px] py-[8px]">
          <h1 className="font-[family-name:Arial,sans-serif] text-[24px] leading-[20px] text-[#1e293b]">
            Sign in to your account
          </h1>
        </div>

        <div className="h-[54px]" />

        <div className="flex flex-col gap-[18px] px-[10px] pb-[20px]">
          <button
            type="button"
            onClick={() => void signIn("cognito", { callbackUrl: "/experience" })}
            className="flex h-[38px] w-[220px] items-center justify-center rounded-[26px] bg-[#0284c7] font-[family-name:Arial,sans-serif] text-[12px] font-bold text-[#f8fafc] transition-colors hover:bg-[#0369a1]"
          >
            Continue with Cognito
          </button>
          <p className="font-[family-name:Arial,sans-serif] text-[12px] text-slate-900">
            You will be redirected to complete sign in.
          </p>
        </div>
      </div>
    </div>
  );
}
