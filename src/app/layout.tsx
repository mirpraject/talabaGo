import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import AuthModal from "@/components/AuthModal";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "TalabaGo v2 — O'qish, Rivojlanish, Erishish",
  description:
    "O'zbekiston talabalari uchun yagona premium akademik platforma. Konspektlar, testlar, AI yordamchi va yulduzlar tizimi.",
  keywords: "talaba, akademik, konspekt, test, oraliq nazorat, yakuniy nazorat, uzbekistan",
  authors: [{ name: "TalabaGo Team" }],
  icons: {
    icon: "/brand/talabago_icon.jpg",
    apple: "/brand/talabago_icon.jpg",
  },
  openGraph: {
    title: "TalabaGo — O'zbekiston talabalari uchun yagona platforma",
    description: "Konspektlar, testlar, AI yordamchi va real daromad tizimi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Animated mesh background */}
        <div className="mesh-bg" aria-hidden />
        <div className="grid-overlay" aria-hidden />

        <LanguageProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
            <AuthModal />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
