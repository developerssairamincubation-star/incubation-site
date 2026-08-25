import { IntroOverlay } from "@/components/intro/IntroOverlay";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { About } from "@/components/sections/About";
import { FocusAreas } from "@/components/sections/FocusAreas";
import { Startups } from "@/components/sections/Startups";
import { Gallery } from "@/components/sections/Gallery";
import { BuildCta } from "@/components/sections/BuildCta";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <Header />
      <main>
        <Hero />
        <StatsBand />
        <About />
        <FocusAreas />
        <Gallery />
        <Startups />
        <BuildCta />
        <Contact />
      </main>
    </>
  );
}
