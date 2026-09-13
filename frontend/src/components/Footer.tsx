"use client";

import Link from "next/link";
import { Send, Code2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Logo from "@/components/Logo";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-gray-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Logo size="md" textColor="light" />
            </Link>
            <p className="text-gray-400 max-w-md">{t("footer_tagline")}</p>
          </div>


          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer_pages")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tests" className="hover:text-white transition-colors">
                  {t("tests")}
                </Link>
              </li>
              <li>
                <Link href="/learning" className="hover:text-white transition-colors">
                  {t("coding")}
                </Link>
              </li>
              <li>
                <Link href="/premium" className="hover:text-white transition-colors">
                  {t("premium")}
                </Link>
              </li>
              <li>
                <Link href="/files" className="hover:text-white transition-colors">
                  {t("files")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t("footer_about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t("footer_social")}</h3>
            <div className="flex gap-4">
              <a
                href="https://t.me/talabago"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
              >
                <Send className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/talabago"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Code2 className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} TalabaGo. {t("footer_rights")}
        </div>
      </div>
    </footer>
  );
}