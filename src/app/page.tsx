import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";
import Stats from "@/components/Stats";

export default function Home() {
  return (
    <div className="relative z-10">
      <HeroSection />
      <Features />
      <Stats />
    </div>
  );
}