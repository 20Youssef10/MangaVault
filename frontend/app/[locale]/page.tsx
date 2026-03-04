import { HomeHero } from "../../components/HomeHero";
import { ContinueReading } from "../../components/ContinueReading";
import { TrendingSection } from "../../components/TrendingSection";
import { LatestSection } from "../../components/LatestSection";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10 md:px-12">
      <HomeHero />
      <div className="mt-12 space-y-12">
        <ContinueReading />
        <TrendingSection />
        <LatestSection />
      </div>
    </main>
  );
}
