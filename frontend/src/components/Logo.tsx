import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textColor?: "dark" | "light";
  className?: string;
  showSlogan?: boolean;
}

export default function Logo({
  size = "md",
  showText = true,
  textColor = "dark",
  className = "",
  showSlogan = true,
}: LogoProps) {
  const { lang } = useLanguage();

  const sloganMap: Record<string, string> = {
    uz: "O'qish • Rivojlanish • Erishish",
    kaa: "Oqıw • Rawajlanıw • Jetiskenlik",
    ru: "Учеба • Развитие • Достижения",
    en: "Study • Growth • Success",
  };

  const slogan = sloganMap[lang] || sloganMap.uz;

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10 sm:w-11 sm:h-11",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const iconDimensions = {
    sm: 32,
    md: 44,
    lg: 56,
    xl: 80,
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-3xl",
    xl: "text-4xl sm:text-5xl",
  };

  const sloganSizes = {
    sm: "text-[8px]",
    md: "text-[9px] sm:text-[10px]",
    lg: "text-xs",
    xl: "text-sm",
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 shrink-0 select-none group ${className}`}>
      {/* 3D Glassmorphic Animated Emblem */}
      <div
        className={`${iconSizes[size]} relative shrink-0 rounded-2xl p-0.5 bg-gradient-to-br from-blue-500 via-teal-400 to-emerald-500 shadow-md shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-teal-500/30 transition-all duration-300 group-hover:scale-105 overflow-hidden`}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm pointer-events-none rounded-2xl" />

        {/* Shine Sweep Animation on Hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />

        <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-white flex items-center justify-center">
          <Image
            src="/brand/talabago_icon.jpg"
            alt="TalabaGo 3D Emblem"
            width={iconDimensions[size]}
            height={iconDimensions[size]}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
            priority
          />
        </div>
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center tracking-tight leading-none font-black">
            <span
              className={`${textSizes[size]} transition-colors duration-200 ${
                textColor === "dark" ? "text-slate-900 group-hover:text-blue-900" : "text-white"
              }`}
            >
              Talaba
            </span>
            <span
              className={`${textSizes[size]} bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent font-extrabold tracking-normal ml-0.5 flex items-center`}
            >
              Go
              {/* Dynamic Rocket / Pulse Indicator */}
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1 animate-pulse shadow-sm shadow-emerald-400" />
            </span>
          </div>

          {showSlogan && (
            <span
              className={`${sloganSizes[size]} font-bold tracking-wider uppercase mt-1 transition-colors ${
                textColor === "dark"
                  ? "text-slate-500 group-hover:text-teal-600"
                  : "text-slate-300 group-hover:text-teal-300"
              }`}
            >
              {slogan}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
