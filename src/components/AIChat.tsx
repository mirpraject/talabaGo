"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Loader2, X, FileText, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { api } from "@/lib/api";

type ChatFile = { id: number; title: string };

type ChatMessage = {
  role: "user" | "ai";
  text: string;
  files?: ChatFile[];
};

export default function AIChat() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: t("ai_greeting") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollDown = useCallback(() => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);
    scrollDown();

    try {
      const res = await api.post<{ reply: string; files: ChatFile[] }>(
        "/api/ai/chat",
        { message: text }
      );
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: res.reply, files: res.files?.length ? res.files : undefined },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: t("ai_error") }]);
    } finally {
      setLoading(false);
      scrollDown();
    }
  }

  if (!user) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105"
        title={t("ai_title")}
      >
        {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            style={{ maxHeight: "min(520px, calc(100vh - 120px))" }}
          >
            {/* Header */}
            <div className="bg-primary-600 text-white px-5 py-3.5 flex items-center gap-2.5">
              <Bot className="w-5 h-5" />
              <div>
                <p className="font-semibold text-sm">{t("ai_title")}</p>
                <p className="text-xs text-primary-100">{t("ai_subtitle")}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                    {msg.files && msg.files.length > 0 && (
                      <div className="mt-2 space-y-1 border-t border-gray-200/50 pt-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">{t("ai_files_found")}</p>
                        {msg.files.map((f) => (
                          <a
                            key={f.id}
                            href={`/files/${f.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 hover:underline"
                          >
                            <FileText className="w-3 h-3" />
                            {f.title}
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                    {t("ai_thinking")}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-3 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("ai_placeholder")}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}