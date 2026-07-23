"use client";

import { useRef } from "react";
import Footer from "@/components/Footer";
import CategoriesSlide from "./CategoriesSlide";
import CtaSlide from "./CtaSlide";
import HeroSlide from "./HeroSlide";
import PartnersSlide from "./PartnersSlide";
import SlideIndicator from "./SlideIndicator";
import StatsSlide from "./StatsSlide";
import SlideLabel from "./SlideLabel";
import { SECTIONS } from "./sections";
import { useActiveSection } from "./hooks/useActiveSection";
import { useHeroIntro } from "./hooks/useHeroIntro";
import { useHomeData } from "./hooks/useHomeData";

/**
 * The home page is a snap-scrolling viewport that contains five slides
 * (hero, categories, stats, partners, news/CTA) followed by the global Footer.
 *
 * Most of the cleverness lives in the hooks:
 *   - useHomeData       fetches everything the slides need
 *   - useActiveSection  reports which slide is currently in view
 *   - useHeroIntro      runs the GSAP intro animation
 */
export default function HomePage() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { categories, partners, news } = useHomeData();
  const activeIdx = useActiveSection(scrollerRef);
  useHeroIntro();

  const scrollToIdx = (idx: number) => {
    const sc = scrollerRef.current;
    if (!sc) return;
    const sections = sc.querySelectorAll<HTMLElement>("[data-snap-section]");
    sections[idx]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SlideIndicator activeIdx={activeIdx} count={SECTIONS.length} onJump={scrollToIdx} />
      <SlideLabel activeIdx={activeIdx} />

      <div
        ref={scrollerRef}
        className="h-[100svh] w-full overflow-y-scroll overflow-x-hidden lg:snap-y lg:snap-mandatory bg-white"
        data-lenis-prevent
        style={{ scrollbarWidth: "none" }}
      >
        <HeroSlide active={activeIdx === 0} />
        <CategoriesSlide categories={categories} />
        <StatsSlide />
        <PartnersSlide partners={partners} />
        <CtaSlide news={news} />

        {/* Footer participates in the snap so users can land on it cleanly. */}
        <div className="lg:snap-start">
          <Footer />
        </div>
      </div>
    </>
  );
}
