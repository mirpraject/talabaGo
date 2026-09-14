"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Sparkles,
  Tag,
  Wallet,
  UserCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export type TickerItem = {
  id: string;
  title: string;
  type: string; // "ad" | "news" | "update" | "withdrawal" | "user_joined" | "new_file"
  badge_text?: string | null;
  link_url?: string | null;
  icon?: string | null;
};

const DEFAULT_ITEMS: TickerItem[] = [
  {
    id: "d1",
    title: "TalabaGo 2.0 ishga tushdi — 100 000+ o'quv materiallari va testlar!",
    type: "news",
    badge_text: "YANGILIK",
    link_url: "/files",
    icon: "megaphone",
  },
  {
    id: "d2",
    title: "Foydali konspekt yuklang va har bir yuklab olish uchun pul ishlang!",
    type: "ad",
    badge_text: "REKLAMA",
    link_url: "/rewards",
    icon: "tag",
  },
  {
    id: "d3",
    title: "AI referat va slayd tayyorlash vositasi ishga tushirildi!",
    type: "update",
    badge_text: "YANGILANISH",
    link_url: "/tools/report",
    icon: "sparkles",
  },
];

export default function NewsTicker() {
  const [items, setItems] = useState<TickerItem[]>(DEFAULT_ITEMS);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch live feed from backend
  useEffect(() => {
    let isMounted = true;

    async function fetchLiveFeed() {
      try {
        const data = await api.get<TickerItem[]>("/api/announcements/live");
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      } catch {
        // Fallback to default items if offline
      }
    }

    fetchLiveFeed();
    const refreshInterval = setInterval(fetchLiveFeed, 60000); // 1 min sync
    return () => {
      isMounted = false;
      clearInterval(refreshInterval);
    };
  }, []);

  // Automatic rotation every 4.5 seconds
  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, items.length]);

  const currentItem = items[index] || items[0] || DEFAULT_ITEMS[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % items.length);
  };

  // Badge stylings per type
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "ad":
        return {
          bg: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20",
          icon: Tag,
          defaultLabel: "REKLAMA",
        };
      case "withdrawal":
        return {
          bg: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20",
          icon: Wallet,
          defaultLabel: "PUL YECHISH",
        };
      case "user_joined":
        return {
          bg: "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/20",
          icon: UserCheck,
          defaultLabel: "YANGI TALABA",
        };
      case "new_file":
        return {
          bg: "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-purple-500/20",
          icon: FileText,
          defaultLabel: "YANGI FAYL",
        };
      case "update":
        return {
          bg: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/20",
          icon: Sparkles,
          defaultLabel: "YANGILANISH",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20",
          icon: Megaphone,
          defaultLabel: "YANGILIK",
        };
    }
  };

  const badgeInfo = getBadgeStyle(currentItem.type);
  const BadgeIcon = badgeInfo.icon;
  const badgeLabel = currentItem.badge_text || badgeInfo.defaultLabel;

  const content = (
    <div
      className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-sm max-w-lg w-full text-xs cursor-pointer select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      title={currentItem.title}
    >
      {/* Animated Megaphone / Type Badge */}
      <div
        className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide shadow-sm transition-transform duration-300 ${badgeInfo.bg}`}
      >
        <BadgeIcon className="w-3 h-3 animate-pulse" />
        <span className="hidden xs:inline uppercase">{badgeLabel}</span>
      </div>

      {/* Animated Ticker Message */}
      <div className="relative overflow-hidden h-4 flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id + index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-x-0 flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-medium truncate"
          >
            <span className="truncate">{currentItem.title}</span>
            {currentItem.link_url && (
              <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next controls */}
      {items.length > 1 && (
        <div className="flex items-center gap-0.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity ml-1">
          <button
            onClick={handlePrev}
            className="p-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 transition-colors"
            title="Oldingisi"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 transition-colors"
            title="Keyingisi"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  if (currentItem.link_url) {
    const isExternal = currentItem.link_url.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={currentItem.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center w-full"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={currentItem.link_url} className="flex justify-center w-full">
        {content}
      </Link>
    );
  }

  return <div className="flex justify-center w-full">{content}</div>;
}