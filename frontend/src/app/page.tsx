import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import PlatformShowcase from "@/components/PlatformShowcase";
import SiteInfo from "@/components/SiteInfo";
import Features from "@/components/Features";
import Categories from "@/components/Categories";
import Stats from "@/components/Stats";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PlatformShowcase />
        <SiteInfo />
        <Features />
        <Stats />
        <Categories />
      </main>
      <Footer />
    </div>
  );
}