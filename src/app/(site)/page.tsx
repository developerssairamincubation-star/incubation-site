import { IntroOverlay } from "@/components/intro/IntroOverlay";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { About } from "@/components/sections/About";
import { SairamEcosystem } from "@/components/sections/SairamEcosystem";
import { FocusAreas } from "@/components/sections/FocusAreas";
import { Startups } from "@/components/sections/Startups";
import { Gallery } from "@/components/sections/Gallery";
import { BuildCta } from "@/components/sections/BuildCta";
import { Team } from "@/components/sections/Team";
import { Contact } from "@/components/sections/Contact";
import { getSiteContent } from "@/lib/content/repository";

export default async function Home() {
  // Rendered once and cached; saving in /admin revalidates this page.
  const content = await getSiteContent();

  return (
    <>
      <IntroOverlay />
      <Header showTeam={content.team.length > 0} />
      <main>
        <Hero slides={content.hero} />
        <StatsBand />
        <About />
        <SairamEcosystem />
        <FocusAreas />
        <Gallery events={content.gallery} />
        <Startups logos={content.startups} />
        <BuildCta />
        <Team members={content.team} />
        <Contact />
      </main>
    </>
  );
}
