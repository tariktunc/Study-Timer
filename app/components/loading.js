"use client";
import React from "react";

export default function Loading() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-4"
      role="status"
      aria-label="Yükleniyor"
    >
      {/* Timer icon animation */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        style={{ animation: "pulse 1.5s ease-in-out infinite" }}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" opacity="0.5" />
        <path
          d="M12 6v6l4 2"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-xl font-bold opacity-80">Yükleniyor...</p>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
