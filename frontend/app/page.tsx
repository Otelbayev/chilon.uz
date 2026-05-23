'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import { useLang } from '@/lib/i18n';
import { api, pickLang, productImage } from '@/lib/api';
import type { Product, Partner, NewsItem } from '@/lib/types';

const SECTIONS = ['hero', 'products', 'partners', 'cta'] as const;
type SectionKey = (typeof SECTIONS)[number];

export default function HomePage() {
  const { lang, t } = useLang();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.products(lang, { limit: 12 }),
      api.partners(lang),
      api.news(lang, { limit: 3 }),
    ]).then(([p, parts, n]) => {
      if (cancelled) return;
      setProducts((Array.isArray(p) ? p : p.items)?.slice(0, 12) || []);
      setPartners((parts || []).slice(0, 12));
      setNews((Array.isArray(n) ? n : n.items)?.slice(0, 3) || []);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [lang]);

  // GSAP intro animation for hero (runs once on mount)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('[data-hero-tag]', { y: 30, opacity: 0, duration: 0.7, delay: 0.15 })
        .from('[data-hero-line]', { y: 60, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.4')
        .from('[data-hero-sub]', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
        .from('[data-hero-cta]', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
        .from('[data-hero-stat]', { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.4')
        .from('[data-hero-carousel]', { scale: 0.7, opacity: 0, duration: 1.0, ease: 'power2.out' }, '-=0.9');
    });
    return () => ctx.revert();
  }, []);

  // Active section tracking (works for snap AND natural scroll)
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    const sections = Array.from(sc.querySelectorAll<HTMLElement>('[data-snap-section]'));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the section with the biggest intersection ratio
        let bestIdx = -1, bestRatio = 0;
        entries.forEach((e) => {
          if (e.intersectionRatio > bestRatio) {
            const idx = sections.indexOf(e.target as HTMLElement);
            if (idx >= 0) {
              bestRatio = e.intersectionRatio;
              bestIdx = idx;
            }
          }
        });
        if (bestIdx >= 0 && bestRatio > 0.4) setActiveIdx(bestIdx);
      },
      { root: sc, threshold: [0.2, 0.4, 0.6, 0.8] }
    );
    sections.forEach((s) => observer.observe(s));

    const onScroll = () => {
      document.documentElement.dataset.homeScrolled = sc.scrollTop > 40 ? '1' : '';
    };
    sc.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      sc.removeEventListener('scroll', onScroll);
      delete document.documentElement.dataset.homeScrolled;
      delete document.documentElement.dataset.heroActive;
    };
  }, []);

  // Tell Header when hero is the active slide
  useEffect(() => {
    document.documentElement.dataset.heroActive = activeIdx === 0 ? '1' : '';
  }, [activeIdx]);

  const scrollToIdx = (idx: number) => {
    const sc = scrollerRef.current;
    if (!sc) return;
    const sections = sc.querySelectorAll<HTMLElement>('[data-snap-section]');
    sections[idx]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <SlideIndicator activeIdx={activeIdx} onJump={scrollToIdx} count={SECTIONS.length} />
      <SlideLabel activeIdx={activeIdx} t={t} />

      <div
        ref={scrollerRef}
        className="h-[100svh] w-full overflow-y-scroll overflow-x-hidden lg:snap-y lg:snap-mandatory bg-white"
        data-lenis-prevent
        style={{ scrollbarWidth: 'none' }}
      >
        <HeroSlide t={t} active={activeIdx === 0} products={products} />
        <ProductsSlide t={t} products={products.slice(0, 6)} />
        <PartnersSlide t={t} partners={partners} />
        <CtaSlide t={t} lang={lang} news={news} />
      </div>
    </>
  );
}

/* ===================================================== */
/* SlideShell — mobile: natural height; desktop: snap     */
/* ===================================================== */
function SlideShell({
  sectionKey, bgClass, pattern, children, padded = true,
}: {
  sectionKey: SectionKey;
  bgClass: string;
  pattern?: React.ReactNode;
  children: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <section
      data-snap-section
      data-section={sectionKey}
      className={`relative w-full overflow-hidden min-h-[100svh] lg:h-[100svh] lg:snap-start lg:snap-always ${bgClass}`}
    >
      <div className="pointer-events-none absolute inset-0">{pattern}</div>
      <div className={`relative z-10 w-full h-full ${padded ? 'py-20 sm:py-24 lg:py-0' : ''}`}>
        {children}
      </div>
    </section>
  );
}

/* ===================================================== */
/* HERO — video bg + carousel on right                    */
/* ===================================================== */
function HeroSlide({
  t, active, products,
}: {
  t: (k: string) => string;
  active: boolean;
  products: Product[];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);

  return (
    <section
      data-snap-section
      data-section="hero"
      className="relative w-full overflow-hidden min-h-[100svh] lg:h-[100svh] lg:snap-start lg:snap-always bg-black"
    >
      {/* Video background */}
      <video
        ref={videoRef}
        src="/chilon.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 size-full object-cover"
      />

      {/* Overlays for readability */}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/10 to-black/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/55" />

      {/* Decorative side glow accents — make the edges feel rich */}
      <div className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 size-[28rem] rounded-full bg-brand-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 size-[24rem] rounded-full bg-brand-400/10 blur-[100px]" />

      {/* Content — edge-to-edge full-width layout */}
      <div className="relative z-10 min-h-[100svh] lg:h-full flex flex-col justify-center pt-24 lg:pt-20 pb-16 lg:pb-12 px-6 sm:px-10 lg:px-14 xl:px-20 2xl:px-28">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-10 xl:gap-16 w-full">

          {/* LEFT — text + CTAs + stats */}
          <div className="order-2 lg:order-1 text-white lg:flex-1 lg:max-w-[640px]">
            <span
              data-hero-tag
              className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur border border-white/25 px-3.5 py-1.5 text-[11px] sm:text-sm font-medium text-white shadow-lg shadow-black/10"
            >
              <span className="size-1.5 rounded-full bg-brand-400" />
              {t('hero.tag')}
            </span>
            <h1 className="display mt-5 sm:mt-7 text-[2.25rem] sm:text-5xl lg:text-[3.75rem] xl:text-7xl 2xl:text-[5.5rem] font-bold leading-[0.98] tracking-tight">
              <span data-hero-line className="block">
                {t('hero.title').split(' ').slice(0, Math.ceil(t('hero.title').split(' ').length / 2)).join(' ')}
              </span>
              <span data-hero-line className="block text-brand-400">
                {t('hero.title').split(' ').slice(Math.ceil(t('hero.title').split(' ').length / 2)).join(' ')}
              </span>
            </h1>
            <p data-hero-sub className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/85 max-w-xl leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link href="/products" className="btn-primary shadow-xl shadow-brand-500/30" data-hero-cta>
                {t('hero.cta.products')}
                <Arrow />
              </Link>
              <Link
                href="/contacts"
                data-hero-cta
                className="inline-flex items-center justify-center gap-2 rounded-full font-medium border border-white/30 bg-white/10 text-white backdrop-blur px-6 py-3 transition-all duration-300 hover:bg-white hover:text-ink-900"
              >
                {t('hero.cta.contact')}
              </Link>
            </div>

            {/* Stats — minimalist divider style on desktop */}
            <div className="mt-8 sm:mt-10 lg:mt-12 flex flex-wrap items-stretch gap-5 sm:gap-7 lg:gap-8">
              {[
                { v: '130+', k: 'home.stat.products' },
                { v: '12',  k: 'home.stat.categories' },
                { v: '15+', k: 'home.stat.years' },
              ].map((s, i) => (
                <div
                  key={s.k}
                  data-hero-stat
                  className={`flex flex-col ${i > 0 ? 'lg:border-l lg:border-white/20 lg:pl-6 xl:pl-8' : ''}`}
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                    {s.v}
                  </div>
                  <div className="text-[11px] sm:text-xs lg:text-sm text-white/70 mt-1 uppercase tracking-wider leading-tight">
                    {t(s.k)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — product carousel anchored to right edge */}
          <div
            data-hero-carousel
            className="order-1 lg:order-2 shrink-0 flex justify-center lg:justify-end self-center"
          >
            <ProductCarousel products={products} t={t} />
          </div>
        </div>
      </div>

      <ScrollHint light />
    </section>
  );
}

/* ===================================================== */
/* Product Carousel (auto-rotate)                         */
/* ===================================================== */
function ProductCarousel({
  products, t,
}: { products: Product[]; t: (k: string) => string }) {
  const [idx, setIdx] = useState(0);
  const slice = products.slice(0, 6);

  useEffect(() => {
    if (slice.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % slice.length), 3800);
    return () => clearInterval(id);
  }, [slice.length]);

  if (slice.length === 0) {
    return (
      <div className="w-[15rem] sm:w-[18rem] lg:w-[22rem] aspect-[3/4] rounded-[2rem] bg-white/10 backdrop-blur animate-pulse" />
    );
  }

  const current = slice[idx];
  const img = productImage(current);

  return (
    <Link
      href={`/products/${current.id}`}
      className="group relative block w-[15rem] sm:w-[18rem] lg:w-[22rem] aspect-[3/4] rounded-[2rem] overflow-hidden bg-white/95 backdrop-blur border border-white/40 shadow-2xl shadow-black/30 hover:shadow-brand-500/30 hover:-translate-y-1 transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-100" />
      <div className="absolute -top-16 -right-12 size-44 rounded-full bg-brand-300/30 blur-2xl" />

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.6, ease: [0.21, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {current.code && (
            <span className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full bg-white/95 backdrop-blur px-2.5 py-1 text-[10px] sm:text-xs font-medium text-ink-700 shadow z-10">
              {current.code}
            </span>
          )}
          <div className="absolute inset-x-0 top-6 sm:top-8 bottom-[34%] grid place-items-center px-5">
            <img
              src={img}
              alt={current.name}
              className="max-h-full max-w-full object-contain drop-shadow-xl transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-white via-white/95 to-transparent pt-10">
            <div className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-brand-600">
              {t('hero.tag')}
            </div>
            <h3 className="mt-1 text-sm sm:text-base lg:text-lg font-semibold text-ink-900 line-clamp-2 group-hover:text-brand-700 transition-colors">
              {current.name}
            </h3>
            <div className="mt-2 flex items-center gap-1 text-xs sm:text-sm font-medium text-brand-600">
              <span>{t('news.readMore')}</span>
              <Arrow />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex gap-1.5 z-10">
        {slice.map((_, i) => (
          <span
            key={i}
            className={`block h-1 rounded-full transition-all duration-500 ${
              i === idx ? 'w-6 bg-brand-500' : 'w-1 bg-ink-300'
            }`}
          />
        ))}
      </div>
    </Link>
  );
}

/* ===================================================== */
/* Slide 2: PRODUCTS                                      */
/* ===================================================== */
function ProductsSlide({
  t, products,
}: { t: (k: string) => string; products: Product[] }) {
  return (
    <SlideShell
      sectionKey="products"
      bgClass="bg-gradient-to-b from-[#fafdf8] to-white"
      pattern={
        <>
          <div className="absolute top-20 right-[15%] size-[20rem] sm:size-[26rem] rounded-full bg-brand-100/40 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'radial-gradient(circle, #059669 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </>
      }
    >
      <div className="container-x h-full flex flex-col justify-center">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-2xl">
            <RevealOnView>
              <span className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] sm:text-sm font-medium text-brand-700">
                02 — {t('hero.tag')}
              </span>
            </RevealOnView>
            <RevealOnView delay={0.08}>
              <h2 className="display mt-3 text-[1.75rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1]">
                {t('products.title')}
              </h2>
            </RevealOnView>
            <RevealOnView delay={0.14}>
              <p className="mt-2.5 text-sm sm:text-base text-ink-700 max-w-xl">
                {t('products.subtitle')}
              </p>
            </RevealOnView>
          </div>
          <RevealOnView delay={0.18}>
            <Link href="/products" className="btn-primary shrink-0">
              {t('hero.cta.products')}
              <Arrow />
            </Link>
          </RevealOnView>
        </div>

        <RevealOnView delay={0.22}>
          <div className="mt-7 sm:mt-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {products.slice(0, 6).map((p, i) => (
              <ModernProductCard key={p.id} product={p} idx={i} t={t} />
            ))}
          </div>
        </RevealOnView>
      </div>
    </SlideShell>
  );
}

/* ===================================================== */
/* Modern product card                                    */
/* ===================================================== */
function ModernProductCard({
  product, idx, t,
}: { product: Product; idx: number; t: (k: string) => string }) {
  const img = productImage(product, idx);
  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative block aspect-[3/4] rounded-3xl overflow-hidden bg-white border border-ink-100 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/15 hover:-translate-y-1 transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/60 via-white to-brand-100/40" />
      {product.code && (
        <span className="absolute top-2.5 right-2.5 z-10 rounded-full bg-white/95 backdrop-blur px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-ink-700 shadow-sm">
          {product.code}
        </span>
      )}
      <div className="absolute inset-x-0 top-4 bottom-[32%] grid place-items-center px-3">
        <img
          src={img}
          alt={product.name}
          className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-white via-white/95 to-transparent pt-8">
        <h3 className="text-[11px] sm:text-xs font-semibold text-ink-900 line-clamp-2 group-hover:text-brand-700 transition-colors leading-tight">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-1 text-[10px] sm:text-xs font-medium text-brand-600 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
          <span>{t('news.readMore')}</span>
          <Arrow />
        </div>
      </div>
    </Link>
  );
}

/* ===================================================== */
/* Slide 3: PARTNERS                                      */
/* ===================================================== */
function PartnersSlide({
  t, partners,
}: { t: (k: string) => string; partners: Partner[] }) {
  return (
    <SlideShell
      sectionKey="partners"
      bgClass="bg-gradient-to-b from-[#f5fbf8] via-white to-[#f9fdfa]"
      pattern={
        <>
          <div className="absolute top-[15%] -left-20 size-[20rem] sm:size-[28rem] rounded-full bg-brand-100/45 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(#059669 1px, transparent 1px), linear-gradient(90deg, #059669 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </>
      }
    >
      <div className="container-x h-full flex flex-col justify-center">
        <div className="max-w-2xl">
          <RevealOnView>
            <span className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] sm:text-sm font-medium text-brand-700">
              03 — {t('partners.subtitle')}
            </span>
          </RevealOnView>
          <RevealOnView delay={0.08}>
            <h2 className="display mt-3 text-[1.75rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1]">
              {t('partners.title')}
            </h2>
          </RevealOnView>
        </div>

        <RevealOnView delay={0.18}>
          <div className="mt-7 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {partners.map((p) => (
              <div
                key={p.id}
                className="group aspect-[3/2] grid place-items-center rounded-2xl border border-ink-100 bg-white/90 backdrop-blur p-4 hover:border-brand-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-500"
              >
                <span className="text-[10px] sm:text-xs font-semibold text-ink-500 group-hover:text-brand-600 text-center line-clamp-2 transition-colors">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </RevealOnView>

        <RevealOnView delay={0.28}>
          <div className="mt-7 sm:mt-9">
            <Link href="/partners" className="btn-ghost">
              {t('news.readMore')}
              <Arrow />
            </Link>
          </div>
        </RevealOnView>
      </div>
    </SlideShell>
  );
}

/* ===================================================== */
/* Slide 4: NEWS + CTA                                    */
/* ===================================================== */
function CtaSlide({
  t, lang, news,
}: { t: (k: string) => string; lang: 'uz' | 'en' | 'ru'; news: NewsItem[] }) {
  const year = new Date().getFullYear();
  return (
    <SlideShell
      sectionKey="cta"
      bgClass="bg-gradient-to-br from-white via-[#f6fcf9] to-[#e6f7ef]"
      pattern={
        <>
          <div className="absolute top-[10%] right-[10%] size-[22rem] sm:size-[32rem] rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute bottom-[5%] left-[5%] size-[18rem] sm:size-[24rem] rounded-full bg-brand-100/50 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #059669 0, #059669 1px, transparent 1px, transparent 24px)',
            }}
          />
        </>
      }
    >
      <div className="container-x h-full flex flex-col justify-center pb-10 lg:pb-14">
        <div className="max-w-2xl">
          <RevealOnView>
            <span className="inline-flex rounded-full bg-brand-50 px-3.5 py-1.5 text-[11px] sm:text-sm font-medium text-brand-700">
              04 — {t('news.subtitle')}
            </span>
          </RevealOnView>
          <RevealOnView delay={0.08}>
            <h2 className="display mt-3 text-[1.75rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1]">
              {t('news.title')}
            </h2>
          </RevealOnView>
        </div>

        <RevealOnView delay={0.16}>
          <div className="mt-7 sm:mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((n, i) => {
              const title = pickLang(n.title as any, lang);
              const img = productImage({ id: n.slug }, i);
              return (
                <Link
                  key={n.id}
                  href={`/news/${n.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-ink-100 bg-white hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/15 hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-brand-50/70 to-brand-100/60 grid place-items-center p-6">
                    <img
                      src={img}
                      alt={title}
                      className="max-h-[85%] max-w-[70%] object-contain drop-shadow-md transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <time className="text-[10px] font-medium text-brand-600 uppercase tracking-wider">
                      {new Date(n.date).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </time>
                    <h3 className="mt-1.5 text-sm sm:text-base font-semibold text-ink-900 line-clamp-2 group-hover:text-brand-700 transition-colors leading-snug">
                      {title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </RevealOnView>

        <RevealOnView delay={0.28}>
          <div className="mt-7 sm:mt-9 flex flex-wrap gap-2.5 sm:gap-3">
            <Link href="/news" className="btn-ghost">{t('news.title')}</Link>
            <Link href="/contacts" className="btn-primary">
              {t('hero.cta.contact')}
              <Arrow />
            </Link>
          </div>
        </RevealOnView>

        <div className="mt-8 lg:absolute lg:bottom-4 lg:inset-x-0 text-center text-[10px] sm:text-[11px] text-ink-500 px-4">
          © {year} Chilon. {t('footer.rights')}.
        </div>
      </div>
    </SlideShell>
  );
}

/* ===================================================== */
/* Helpers                                                */
/* ===================================================== */

function RevealOnView({
  children, delay = 0,
}: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SlideIndicator({
  activeIdx, onJump, count,
}: { activeIdx: number; onJump: (i: number) => void; count: number }) {
  return (
    <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-2.5 sm:gap-3">
      {Array.from({ length: count }).map((_, i) => {
        const isOnHero = activeIdx === 0;
        return (
          <button
            key={i}
            onClick={() => onJump(i)}
            aria-label={`Slide ${i + 1}`}
            className="group relative grid place-items-center"
          >
            <span
              className={`block w-1.5 rounded-full transition-all duration-500 ${
                i === activeIdx
                  ? (isOnHero ? 'h-7 sm:h-9 bg-white' : 'h-7 sm:h-9 bg-brand-500')
                  : (isOnHero ? 'h-1.5 bg-white/50 group-hover:bg-white group-hover:h-3' : 'h-1.5 bg-ink-300 group-hover:bg-brand-400 group-hover:h-3')
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

function SlideLabel({ activeIdx, t }: { activeIdx: number; t: (k: string) => string }) {
  const labels: Record<SectionKey, string> = {
    hero: t('nav.home'),
    products: t('nav.products'),
    partners: t('nav.partners'),
    cta: t('nav.news'),
  };
  const key = SECTIONS[activeIdx];
  const isHero = activeIdx === 0;
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none hidden xl:flex flex-col items-center gap-3">
      <span className={`block w-px h-12 ${isHero ? 'bg-white/40' : 'bg-ink-300'}`} />
      <span
        className={`text-[10px] uppercase tracking-[0.3em] font-medium ${isHero ? 'text-white/70' : 'text-ink-500'}`}
        style={{ writingMode: 'vertical-rl' }}
      >
        0{activeIdx + 1} / 0{SECTIONS.length}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className={`text-xs font-semibold ${isHero ? 'text-brand-300' : 'text-brand-700'}`}
          style={{ writingMode: 'vertical-rl' }}
        >
          {labels[key]}
        </motion.span>
      </AnimatePresence>
      <span className={`block w-px h-12 ${isHero ? 'bg-white/40' : 'bg-ink-300'}`} />
    </div>
  );
}

function ScrollHint({ light = false }: { light?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className={`absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-none ${light ? 'text-white/75' : 'text-ink-500'}`}
    >
      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-medium">scroll</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className={`size-7 sm:size-8 rounded-full border grid place-items-center ${light ? 'border-white/40' : 'border-ink-300'}`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
