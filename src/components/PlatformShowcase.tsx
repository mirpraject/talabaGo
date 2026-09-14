"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { showcaseTranslations } from "@/lib/showcaseTranslations";
import {
  Sparkles,
  ClipboardList,
  Code2,
  FileText,
  Bot,
  Star,
  CheckCircle2,
  ArrowRight,
  Zap,
  Play,
  Crown,
  Lock,
  Check,
  UserCheck,
  LogIn,
} from "lucide-react";

export default function PlatformShowcase() {
  const { user, openAuthModal } = useAuth();
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("tests");

  // Get current language content with safe fallback to uz
  const content = showcaseTranslations[lang] || showcaseTranslations.uz;
  const showcaseTabs = content.tabs;
  const currentTab = showcaseTabs.find((t) => t.id === activeTab) || showcaseTabs[0];

  // Interactive widget states
  // 1. Interactive test simulation
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [testAnswerFeedback, setTestAnswerFeedback] = useState<boolean | null>(null);

  // 2. Interactive star calculator
  const [calcStars, setCalcStars] = useState<number>(300);

  // 3. Interactive live code simulation
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [codeRunning, setCodeRunning] = useState<boolean>(false);

  // 4. Interactive AI simulation
  const [aiTopic, setAiTopic] = useState(content.aiTopicDefault);
  const [aiGenerated, setAiGenerated] = useState(false);

  function handleAnswerTest(choice: string) {
    setSelectedAnswer(choice);
    if (choice === "C") {
      setTestAnswerFeedback(true);
    } else {
      setTestAnswerFeedback(false);
    }
  }

  function handleRunSimulatedCode() {
    setCodeRunning(true);
    setCodeOutput(null);
    setTimeout(() => {
      setCodeRunning(false);
      setCodeOutput(content.codeOutputSuccess);
    }, 600);
  }

  return (
    <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-pink-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider shadow-lg ${
              user
                ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300 shadow-emerald-500/10"
                : "bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 border-amber-400/30 text-amber-300 shadow-indigo-500/10"
            }`}
          >
            {user ? (
              <>
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {content.simTopStatusUser} ({user.full_name || user.username})
                </span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                <span>{content.headerBadge}</span>
              </>
            )}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black tracking-tight"
          >
            {content.headerTitleStart}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {content.headerTitleHighlight}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-slate-400 text-base sm:text-lg leading-relaxed"
          >
            {user ? content.headerSubtitleUser : content.headerSubtitleGuest}
          </motion.p>
        </div>

        {/* Interactive Feature Selectors (Tabs) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {showcaseTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedAnswer(null);
                  setTestAnswerFeedback(null);
                }}
                className={`group p-3.5 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? "bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/20 scale-102"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400 animate-pulse" />
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1">
                    {item.title.split(" ")[0]} {item.title.split(" ")[1] || ""}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {item.badge}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden"
          >
            {/* Left Column: Description & Highlights (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${currentTab.badgeColor}`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  {currentTab.badge}
                </span>

                <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {currentTab.title}
                </h3>

                <p className="text-indigo-300 font-semibold text-sm sm:text-base">
                  {currentTab.subtitle}
                </p>

                <p className="text-slate-400 text-sm leading-relaxed">
                  {currentTab.description}
                </p>
              </div>

              {/* Bullet Points */}
              <div className="space-y-2.5 pt-2">
                {currentTab.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Auth Notice & Action Button */}
              <div className="pt-2 space-y-3">
                {!user ? (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{content.guestBanner}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{content.userBanner}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {user ? (
                    <Link
                      href={currentTab.ctaLink}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:to-purple-400 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 group"
                    >
                      <span>{currentTab.ctaText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => openAuthModal("register", currentTab.ctaLink)}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                        <span>{content.btnRegisterToUse}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openAuthModal("login", currentTab.ctaLink)}
                        className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        {content.btnLogin}
                      </button>
                    </>
                  )}

                  <Link
                    href="/premium"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors ml-auto sm:ml-0"
                  >
                    <Crown className="w-4 h-4 fill-amber-400" />
                    {content.btnPremium}
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Simulator Widget (6 cols) */}
            <div className="lg:col-span-6 bg-slate-950 rounded-2xl border border-slate-800/80 p-5 sm:p-6 shadow-inner relative">
              {/* Subtle top indicator bar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[11px] text-slate-500 uppercase tracking-wider">
                    {user ? content.simTopTitleUser : content.simTopTitleGuest}
                  </span>
                </div>
                {user ? (
                  <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {content.simTopStatusUser}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAuthModal("register", currentTab.ctaLink)}
                    className="text-amber-400 hover:text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Lock className="w-3 h-3" /> {content.simTopStatusGuest}
                  </button>
                )}
              </div>

              {/* WIDGET 1: Interactive Test Question */}
              {currentTab.interactiveType === "test" && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
                    <span>{content.testQuestionTitle}</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> +1.2⭐
                    </span>
                  </div>

                  <p className="text-sm font-bold text-white leading-relaxed">
                    {content.testQuestionText}
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { key: "A", val: "14" },
                      { key: "B", val: "16" },
                      { key: "C", val: "18" },
                      { key: "D", val: "22" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => handleAnswerTest(opt.key)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2.5 cursor-pointer ${
                          selectedAnswer === opt.key
                            ? opt.key === "C"
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                              : "bg-rose-500/20 border-rose-500 text-rose-300"
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                        }`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-[11px]">
                          {opt.key}
                        </span>
                        <span>{opt.val}</span>
                      </button>
                    ))}
                  </div>

                  {testAnswerFeedback !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        testAnswerFeedback
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                          : "bg-rose-500/20 border-rose-500/40 text-rose-300"
                      }`}
                    >
                      <span>
                        {testAnswerFeedback
                          ? content.testSuccessFeedback
                          : content.testErrorFeedback}
                      </span>
                      {testAnswerFeedback && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-[10px] font-black uppercase">
                          +1.2 ⭐
                        </span>
                      )}
                    </motion.div>
                  )}

                  {!user && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-indigo-500/15 to-purple-500/15 border border-amber-500/40 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{content.testRegisterPrompt}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openAuthModal("register", "/tests")}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-sm transition-all active:scale-95"
                      >
                        {content.statRegisterBadge} →
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* WIDGET 2: Interactive Code Runner */}
              {currentTab.interactiveType === "code" && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 leading-relaxed whitespace-pre">
                    {content.codeRunnerComment}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleRunSimulatedCode}
                      disabled={codeRunning}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-60"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      {codeRunning ? content.codeRunning : content.codeRunBtn}
                    </button>
                    <span className="text-[11px] text-slate-400">Exit Code: 0</span>
                  </div>

                  {codeOutput && (
                    <div className="space-y-2">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-xs font-mono whitespace-pre-wrap"
                      >
                        {codeOutput}
                      </motion.div>

                      {!user ? (
                        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-sans">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{content.codeRegisterPrompt}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => openAuthModal("register", "/learning")}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer transition-all active:scale-95"
                          >
                            {content.statRegisterBadge} →
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end font-sans">
                          <Link
                            href="/learning"
                            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                          >
                            {content.codeFullLabLink}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* WIDGET 3: Star to Cash Calculator */}
              {currentTab.interactiveType === "calculator" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{content.calcAmountLabel}</span>
                    <span className="text-lg font-black text-amber-400 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400" />
                      {calcStars} ★
                    </span>
                  </div>

                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={calcStars}
                    onChange={(e) => setCalcStars(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 text-center space-y-1">
                    <span className="text-xs text-slate-400">{content.calcReceiveLabel}</span>
                    <p className="text-3xl font-black text-amber-300 tracking-tight">
                      {(Math.floor(calcStars / 100) * 10000).toLocaleString("uz-UZ")}{" "}
                      <span className="text-base font-bold text-white">{content.calcCurrency}</span>
                    </p>
                    <p className="text-[11px] text-amber-200/80">
                      {content.calcRateNotice}
                    </p>
                  </div>

                  {!user && (
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{content.calcRegisterPrompt}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openAuthModal("register", "/rewards")}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer transition-all active:scale-95"
                      >
                        {content.statRegisterBadge} →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* WIDGET 4: Star Transfer Simulation */}
              {currentTab.interactiveType === "transfer" && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="text-slate-400 block">{content.transferIdLabel}</label>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/40">
                        T000002
                      </span>
                      <span className="text-slate-300 font-semibold">{content.transferReceiver}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">{content.transferAmountLabel}</span>
                    <span className="font-bold text-amber-400 text-sm">25.0 ⭐</span>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{content.transferNotice}</span>
                  </div>

                  {!user && (
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{content.transferRegisterPrompt}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openAuthModal("register", "/rewards")}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer transition-all active:scale-95"
                      >
                        {content.statRegisterBadge} →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* WIDGET 5: AI Generator Simulation */}
              {currentTab.interactiveType === "ai" && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 block">{content.aiTopicLabel}</label>
                    <input
                      type="text"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!user) {
                        openAuthModal("register", "/tools/report");
                      } else {
                        setAiGenerated(true);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Bot className="w-4 h-4" /> {content.aiBtnGenerate}
                  </button>

                  {aiGenerated && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-slate-300 space-y-1"
                    >
                      <div className="font-bold text-purple-300">{content.aiPlanTitle}</div>
                      <div className="text-[11px] space-y-0.5 text-slate-400 font-mono">
                        {content.aiPlanItems.map((item, idx) => (
                          <div key={idx}>{item}</div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {!user && (
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{content.aiRegisterPrompt}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => openAuthModal("register", "/tools/report")}
                        className="px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-black text-xs shrink-0 cursor-pointer transition-all active:scale-95"
                      >
                        {content.statRegisterBadge} →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* WIDGET 6: Academic Files Simulation */}
              {currentTab.interactiveType === "files" && (
                <div className="space-y-2.5 text-xs">
                  {content.filesData.map((f, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                        <div className="truncate">
                          <div className="font-bold text-slate-200 truncate">{f.name}</div>
                          <div className="text-[10px] text-slate-500">{f.size} • {f.downloads} downloads</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!user) {
                            openAuthModal("register", "/files");
                          } else {
                            window.location.href = "/files";
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                          user
                            ? "bg-white/10 hover:bg-white/20 text-white"
                            : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {!user && <Lock className="w-3 h-3 text-amber-400" />}
                        {user ? content.fileDownloadBtn : content.statRegisterBadge}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 3 Quick Value Stats Cards (Auth-aware and Multilingual) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {user ? (
            <Link
              href="/tests"
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 flex items-center justify-between gap-4 transition-all group hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{content.statTestsTitle}</div>
                  <p className="text-xs text-slate-400 mt-0.5">{content.statTestsDesc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1 shrink-0">
                <Check className="w-3.5 h-3.5" /> {content.statOpenBadge}
              </span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("register", "/tests")}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 flex items-center justify-between gap-4 transition-all group text-left cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{content.statTestsTitle}</div>
                  <p className="text-xs text-slate-400 mt-0.5">{content.statTestsDesc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 shrink-0">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> {content.statRegisterBadge}
              </span>
            </button>
          )}

          {user ? (
            <Link
              href="/learning"
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 flex items-center justify-between gap-4 transition-all group hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Code2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{content.statCodingTitle}</div>
                  <p className="text-xs text-slate-400 mt-0.5">{content.statCodingDesc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1 shrink-0">
                <Check className="w-3.5 h-3.5" /> {content.statOpenBadge}
              </span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("register", "/learning")}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 flex items-center justify-between gap-4 transition-all group text-left cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Code2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{content.statCodingTitle}</div>
                  <p className="text-xs text-slate-400 mt-0.5">{content.statCodingDesc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 shrink-0">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> {content.statRegisterBadge}
              </span>
            </button>
          )}

          {user ? (
            <Link
              href="/premium"
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between gap-4 transition-all group hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Crown className="w-7 h-7 fill-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{content.statPremiumTitle}</div>
                  <p className="text-xs text-slate-400 mt-0.5">{content.statPremiumDesc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1 shrink-0">
                <Crown className="w-3.5 h-3.5 fill-amber-400" /> Premium
              </span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("register", "/premium")}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 flex items-center justify-between gap-4 transition-all group text-left cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Crown className="w-7 h-7 fill-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{content.statPremiumTitle}</div>
                  <p className="text-xs text-slate-400 mt-0.5">{content.statPremiumDesc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1 shrink-0">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> {content.statRegisterBadge}
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
