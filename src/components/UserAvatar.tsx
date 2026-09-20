"use client";

import React, { useState } from "react";
import { Crown, Zap } from "lucide-react";

interface UserAvatarProps {
  studentId?: string | null;
  avatarUrl?: string | null;
  name?: string | null;
  tier?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showBadge?: boolean;
}

export default function UserAvatar({
  studentId,
  avatarUrl,
  name,
  tier = "free",
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
  const defaultUrl = avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`;

  // Subscription tier borders & rings
  const tierBorderClasses =
    tier === "plus_plus"
      ? "border-2 border-amber-300 ring-2 ring-amber-400/80 shadow-md shadow-amber-500/30"
      : tier === "plus"
      ? "border-2 border-emerald-300 ring-2 ring-emerald-400/70 shadow-sm shadow-emerald-500/25"
      : "border-2 border-white/80 shadow-sm";

  return (
    <div className={`relative inline-flex flex-col items-center shrink-0 ${className}`}>
      <div
        className={`${sizeClasses[size]} relative rounded-full overflow-hidden ${tierBorderClasses} flex items-center justify-center bg-gradient-to-tr ${bgGrad} text-white font-bold select-none transition-all duration-300`}
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

      {/* Mini floating tier icon for Plus and Plus+ */}
      {tier === "plus_plus" && size !== "xs" && (
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md border border-amber-300 z-10">
          <Crown className="w-2.5 h-2.5 fill-slate-950" />
        </span>
      )}
      {tier === "plus" && size !== "xs" && (
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-md border border-emerald-300 z-10">
          <Zap className="w-2 h-2 fill-slate-950" />
        </span>
      )}

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
