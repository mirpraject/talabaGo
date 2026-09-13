import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import AuthModal from "@/components/AuthModal";

export const metadata: Metadata = {
  title: "TalabaGo — O'qish, Rivojlanish, Erishish",
  description:
    "O'zbekiston talabalari uchun yagona akademik platforma. Konspektlar, testlar, oraliq va yakuniy nazorat savollari.",
  icons: {
    icon: "/brand/talabago_icon.jpg",
    apple: "/brand/talabago_icon.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body>
        <LanguageProvider>
          <AuthProvider>
            {children}
            <AuthModal />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
