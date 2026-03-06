"use client";

import { useEffect, useState } from "react";

export default function SessionTimeoutModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleTimeout() {
      setShow(true);
    }
    window.addEventListener("session-timeout", handleTimeout);
    return () => window.removeEventListener("session-timeout", handleTimeout);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex w-[400px] flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef3c7]">
          <span className="text-[1.5rem]">&#9888;</span>
        </div>
        <h2 className="font-[Arial,sans-serif] text-[1.125rem] font-bold text-black">
          Session Timed Out
        </h2>
        <p className="text-center font-[Arial,sans-serif] text-[0.875rem] text-[#404040]">
          Your session has timed out due to inactivity. Please log in again to
          continue.
        </p>
        <button
          type="button"
          onClick={() => {
            window.location.href = "/api/auth/cognito-logout?returnTo=/login";
          }}
          className="w-full rounded bg-link-blue px-4 py-2 font-[Arial,sans-serif] text-[0.875rem] font-bold text-white hover:opacity-90"
        >
          Log In Again
        </button>
      </div>
    </div>
  );
}
