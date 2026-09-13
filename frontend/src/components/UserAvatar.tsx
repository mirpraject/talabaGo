"use client";

import React, { useState } from "react";

interface UserAvatarProps {
  studentId?: string | null;
  avatarUrl?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showBadge?: boolean;
}

export default function UserAvatar({
  studentId,
  avatarUrl,
  name,
  size = "md",
  className = "",
  showBadge = false,
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const seed = studentId || name || "TalabaGo";
  
  // Deterministic color palette generator from seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const gradients = [
    "from-blue-500 via-indigo-600 to-emerald-500",
    "from-emerald-500 via-teal-600 to-blue-600",
    "from-rose-500 via-red-600 to-amber-500",
    "from-blue-600 via-cyan-500 to-emerald-400",
    "from-violet-600 via-purple-600 to-rose-500",
    "from-amber-500 via-emerald-500 to-blue-600",
  ];
  const bgGrad = gradients[Math.abs(hash) % gradients.length];

  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-lg",
    xl: "w-20 h-20 text-2xl",
  };

  const badgeSizes = {
    xs: "text-[8px] px-1 py-0.2",
    sm: "text-[9px] px-1.5 py-0.5",
    md: "text-[10px] px-2 py-0.5",
    lg: "text-xs px-2.5 py-0.5",
    xl: "text-sm px-3 py-1",
  };

  const initial = (name || studentId || "S").trim().charAt(0).toUpperCase();

  // Final fallback image URL using DiceBear Bottts (distinctive robot/student avatar for each student_id)
  const defaultUrl = avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`;

  return (
    <div className={`relative inline-flex flex-col items-center shrink-0 ${className}`}>
      <div
        className={`${sizeClasses[size]} relative rounded-full overflow-hidden border-2 border-white/80 shadow-sm flex items-center justify-center bg-gradient-to-tr ${bgGrad} text-white font-bold select-none`}
      >
        {!imgError ? (
          <img
            src={defaultUrl}
            alt={name || studentId || "Avatar"}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      {showBadge && studentId && (
        <span
          className={`mt-1 font-mono font-bold tracking-wider rounded-md bg-slate-900 text-emerald-400 border border-emerald-500/30 shadow-sm ${badgeSizes[size]}`}
        >
          {studentId}
        </span>
      )}
    </div>
  );
}
