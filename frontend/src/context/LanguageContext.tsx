"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dictionaries, Lang, TranslationKey } from "@/lib/translations";

const LANG_KEY = "studenthub_lang";

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as Lang | null;
    if (saved && saved in dictionaries) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(LANG_KEY, newLang);
  };

  const t = (key: TranslationKey) => dictionaries[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage LanguageProvider ichida ishlatilishi kerak");
  return ctx;
}