import { User } from "@/context/AuthContext";

export type SubscriptionTier = "free" | "plus" | "plus_plus";

export interface TierConfig {
  tier: SubscriptionTier;
  name: string;
  badge: string;
  priceUzs: number;
  starRate: number;
  testLimit: number | null; // null = cheksiz
  accentColor: string;
  bgGradient: string;
  bannerGradient: string;
  cardBg: string;
  borderClass: string;
  textClass: string;
  badgeClass: string;
  avatarRing: string;
}

export const TIER_CONFIGS: Record<SubscriptionTier, TierConfig> = {
  free: {
    tier: "free",
    name: "Oddiy",
    badge: "Oddiy",
    priceUzs: 0,
    starRate: 0.5,
    testLimit: 150,
    accentColor: "#64748b",
    bgGradient: "from-slate-800 to-slate-950",
    bannerGradient: "from-slate-700 via-slate-800 to-slate-900",
    cardBg: "bg-white/[0.03] hover:bg-white/[0.05]",
    borderClass: "border-white/[0.08]",
    textClass: "text-slate-300",
    badgeClass: "bg-slate-700/50 text-slate-300 border-slate-600/40",
    avatarRing: "border-slate-500/40 ring-2 ring-slate-500/20",
  },
  plus: {
    tier: "plus",
    name: "TalabaGo Plus",
    badge: "PLUS",
    priceUzs: 40000,
    starRate: 1.3,
    testLimit: 700,
    accentColor: "#10b981",
    bgGradient: "from-emerald-900/40 to-teal-950/60",
    bannerGradient: "from-emerald-600 via-teal-600 to-cyan-700",
    cardBg: "bg-gradient-to-br from-emerald-500/[0.08] via-teal-500/[0.04] to-transparent",
    borderClass: "border-emerald-500/30 shadow-md shadow-emerald-950/50",
    textClass: "text-emerald-300",
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20",
    avatarRing: "border-emerald-400 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/20",
  },
  plus_plus: {
    tier: "plus_plus",
    name: "TalabaGo Plus+",
    badge: "PLUS+",
    priceUzs: 65000,
    starRate: 1.7,
    testLimit: null, // Cheksiz
    accentColor: "#f59e0b",
    bgGradient: "from-amber-900/40 via-purple-950/50 to-slate-950",
    bannerGradient: "from-amber-600 via-orange-600 to-purple-800",
    cardBg: "bg-gradient-to-br from-amber-500/[0.12] via-purple-500/[0.08] to-transparent",
    borderClass: "border-amber-500/40 shadow-lg shadow-amber-950/60",
    textClass: "text-amber-300",
    badgeClass: "bg-gradient-to-r from-amber-500/25 to-purple-500/25 text-amber-300 border-amber-400/50 shadow-md shadow-amber-500/20 font-black",
    avatarRing: "border-amber-400 ring-2 ring-amber-400/60 shadow-xl shadow-amber-500/30",
  },
};

export function getUserTier(user: User | null | undefined): SubscriptionTier {
  if (!user) return "free";

  const raw = user.subscription_tier as string | undefined;
  if (raw === "plus" || raw === "plus_plus") {
    return raw as SubscriptionTier;
  }
  if (raw === "free") {
    return "free";
  }

  if (user.is_admin) return "plus_plus";
  if (user.is_premium) return "plus";
  return "free";
}

export function getTierConfig(userOrTier: User | SubscriptionTier | null | undefined): TierConfig {
  if (typeof userOrTier === "string" && (userOrTier === "free" || userOrTier === "plus" || userOrTier === "plus_plus")) {
    return TIER_CONFIGS[userOrTier];
  }
  const tier = getUserTier(userOrTier as User);
  return TIER_CONFIGS[tier];
}
