'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useLang } from '@/lib/i18n';
import { CATEGORIES, NEWS, PARTNERS, PRODUCTS, productImage } from '@/lib/data';
import { Reveal, SplitReveal } from '@/components/Reveal';
import Tilt3D from '@/components/Tilt3D';
import Magnetic from '@/components/Magnetic';
import Marquee from '@/components/Marquee';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  return (
    <div className="relative">
      <Hero />
      <MarqueeBand />
      <FeaturedProducts />
      <TechSection />
      <Categories />
      <FactoryShowcase />
      <Partners />
      <News />
      <CtaBlock />
    </div>
  );
}

/* ============================================================ */
/* HERO — clean light layout, scroll-driven, performant          */
/* ============================================================ */
function Hero() {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yMesh = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const yBottle = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const fadeText = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden noise pt-28 lg:pt-32"
      data-section="hero"
    >
      {/* Mesh + grid */}
      <motion.div className="mesh-bg mesh-bg-anim absolute inset-0" style={{ y: yMesh }} />
      <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" />

      {/* Coordinate label (top-right) */}
      <div className="hidden sm:flex absolute top-24 lg:top-28 right-4 lg:right-8 z-10 flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-fg-3]">
        <span>41.30° N · 69.24° E</span>
        <span>Tashkent / UZ</span>
        <span className="text-[--color-amber-600]">EST. 2013</span>
      </div>

      {/* Scroll hint (bottom-left, above metric strip) */}
      <div className="hidden sm:flex absolute bottom-[8.5rem] lg:bottom-[7.5rem] left-4 lg:left-8 z-10 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[--color-fg-3]">
        <span className="size-1.5 rounded-full bg-[--color-amber-500] animate-pulse" />
        {t('hero.scroll')}
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity: fadeText }}
        className="relative z-10 wrap grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pb-32 lg:pb-28"
      >
        {/* LEFT — text */}
        <div className="lg:col-span-7 pt-10 lg:pt-16">
          <Reveal>
            <div className="chip chip-dot">{t('hero.eyebrow')}</div>
          </Reveal>

          <h1 className="display mt-6 sm:mt-8 text-[clamp(2.75rem,8.5vw,8.25rem)] leading-[0.9] tracking-[-0.04em]">
            <SplitReveal text={t('hero.title.l1')} className="block" />
            <SplitReveal text={t('hero.title.l2')} className="block text-grad-amber" delay={0.2} />
            <SplitReveal text={t('hero.title.l3')} className="block text-[--color-fg-2]" delay={0.4} />
          </h1>

          <Reveal delay={0.55}>
            <p className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg text-[--color-fg-2] leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </Reveal>

          <Reveal delay={0.7}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <Link href="/products" className="btn btn-primary">
                  {t('hero.cta.explore')}
                  <ArrowR />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/contacts" className="btn btn-ghost">{t('hero.cta.contact')}</Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        {/* RIGHT — bottle showcase (scroll-driven only) */}
        <div className="lg:col-span-5 relative">
          <Reveal delay={0.3}>
            <motion.div
              style={{ y: yBottle }}
              className="relative aspect-square w-full max-w-[26rem] sm:max-w-md mx-auto"
            >
              {/* Soft amber halo */}
              <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(255,138,31,0.45),transparent_65%)] blur-2xl" />
              {/* Two slow rings */}
              <div className="absolute inset-0 rounded-full border border-[--color-line-2]/60 animate-[spin_80s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border border-dashed border-[--color-amber-500]/35" />

              {/* Bottle */}
              <div className="absolute inset-0 grid place-items-center">
                <img
                  src="/products/gasoline-motor-oil.webp"
                  alt="Chilon Platinum"
                  loading="eager"
                  className="max-h-[80%] max-w-[80%] object-contain drop-shadow-[0_30px_50px_rgba(234,107,0,0.35)]"
                />
              </div>

              {/* Floating spec pills */}
              <FloatBadge top="4%" left="-2%" label="SAE 5W-30" tone="amber" />
              <FloatBadge top="50%" right="-4%" label="API SP" tone="cyan" />
              <FloatBadge bottom="4%" left="4%" label="NVI® base" tone="ink" />
            </motion.div>
          </Reveal>
        </div>
      </motion.div>

      {/* Bottom metric strip */}
      <div className="absolute bottom-0 inset-x-0 border-t border-[--color-line] backdrop-blur-md bg-[--color-bg-0]/75 z-10">
        <div className="wrap grid grid-cols-2 lg:grid-cols-4 gap-px bg-[--color-line]">
          {[
            { v: '9000+', u: t('metric.tons'), k: t('metric.production') },
            { v: '356+', u: t('metric.types'), k: t('metric.products') },
            { v: '2013', u: '', k: t('metric.since') },
            { v: '9', u: '', k: t('metric.regions') },
          ].map((m, i) => (
            <Reveal key={i} delay={0.1 + i * 0.05} className="bg-[--color-bg-0]">
              <div className="px-4 py-5 lg:py-6">
                <div className="flex items-baseline gap-2">
                  <span className="kv-num text-3xl lg:text-4xl">{m.v}</span>
                  {m.u && <span className="font-mono text-[10px] uppercase tracking-widest text-[--color-fg-3]">{m.u}</span>}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[--color-fg-3] line-clamp-1">
                  {m.k}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FloatBadge({ top, left, right, bottom, label, tone }: {
  top?: string; left?: string; right?: string; bottom?: string; label: string; tone?: 'amber' | 'cyan' | 'ink';
}) {
  const toneClass =
    tone === 'amber' ? 'text-[--color-amber-700] border-[--color-amber-500]/50'
    : tone === 'cyan' ? 'text-[--color-cyan-500] border-[--color-cyan-500]/40'
    : 'text-[--color-fg-1] border-[--color-line-2]';
  return (
    <motion.span
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ top, left, right, bottom }}
      className={`absolute inline-flex items-center gap-1.5 rounded-full border bg-[--color-bg-0]/90 backdrop-blur px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest shadow-[0_10px_24px_-12px_rgb(12,14,16,0.35)] ${toneClass}`}
    >
      <span className="size-1 rounded-full bg-current" />
      {label}
    </motion.span>
  );
}

/* ============================================================ */
/* MARQUEE BAND — animated infinite text                         */
/* ============================================================ */
function MarqueeBand() {
  const items = [
    'SAE 5W-30',
    'API SP',
    'NVI® BASE OILS',
    'ISO 9001',
    'ACEA C3',
    'JASO MA-2',
    'ISO 14001',
    'GOST 1033-79',
    '12-STEP SYNTHESIS',
    '∞ DURABILITY',
  ];
  return (
    <section className="border-y border-[--color-line] bg-[--color-bg-1] overflow-hidden">
      <div className="py-6">
        <Marquee>
          {items.map((it, i) => (
            <span key={`a-${i}`} className="inline-flex items-center gap-6 font-display text-3xl sm:text-5xl lg:text-6xl font-medium text-[--color-fg-0]">
              {it}
              <span className="text-[--color-amber-500]">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

/* ============================================================ */
/* FEATURED PRODUCTS — bento + 3D tilt                          */
/* ============================================================ */
function FeaturedProducts() {
  const { t } = useLang();
  const featured = PRODUCTS.filter((p) => (p.tier === 'premium' || /platinum/i.test(p.name))).slice(0, 6);
  const rest = featured.length >= 6 ? featured : PRODUCTS.slice(0, 6);

  return (
    <section className="sec relative">
      <div className="wrap">
        <SectionHeader
          num="01"
          tag={t('sec.products.tag')}
          title={t('sec.products.title')}
          sub={t('sec.products.sub')}
          cta={{ href: '/products', label: t('sec.products.view') }}
        />

        <div className="mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {rest.slice(0, 6).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06} className="h-full">
              <ProductCard product={p} idx={i} compact />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* TECH SECTION — bento grid of features                         */
/* ============================================================ */
function TechSection() {
  const { t } = useLang();

  return (
    <section className="sec relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
      <div className="absolute -top-32 right-0 w-[40rem] h-[40rem] bg-[--color-amber-500]/10 blur-3xl rounded-full pointer-events-none" />

      <div className="wrap relative">
        <SectionHeader
          num="02"
          tag={t('sec.tech.tag')}
          title={t('sec.tech.title')}
          sub={t('sec.tech.sub')}
        />

        <div className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {[
            { t: t('sec.tech.1.t'), d: t('sec.tech.1.d'), color: 'amber' },
            { t: t('sec.tech.2.t'), d: t('sec.tech.2.d'), color: 'cyan' },
            { t: t('sec.tech.3.t'), d: t('sec.tech.3.d'), color: 'amber' },
            { t: t('sec.tech.4.t'), d: t('sec.tech.4.d'), color: 'violet' },
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <Tilt3D intensity={6}>
                <div className="bento p-6 sm:p-7 min-h-[15rem] flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[--color-fg-3]">
                      // 0{i + 1}
                    </span>
                    <span
                      className={`size-10 rounded-xl grid place-items-center ${
                        item.color === 'amber'
                          ? 'bg-[--color-amber-500]/10 text-[--color-amber-400]'
                          : item.color === 'cyan'
                          ? 'bg-[--color-cyan-500]/10 text-[--color-cyan-400]'
                          : 'bg-[--color-violet-500]/10 text-[--color-violet-500]'
                      }`}
                    >
                      <FeatureIcon idx={i} />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-xl sm:text-2xl leading-tight text-[--color-fg-0]">
                      {item.t}
                    </h3>
                    <p className="mt-2 text-sm text-[--color-fg-2] leading-relaxed">{item.d}</p>
                  </div>
                </div>
              </Tilt3D>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureIcon({ idx }: { idx: number }) {
  const icons = [
    <path key="i0" d="M4 14a8 8 0 0 1 16 0c0 4-3 6-8 6s-8-2-8-6Zm8-8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    <path key="i1" d="M12 3v18M5 8l14 8M5 16l14-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />,
    <path key="i2" d="M5 18l4-6 3 3 4-7 3 4M5 21h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    <path key="i3" d="M12 3l7 4-7 4-7-4 7-4Zm-7 8 7 4 7-4M5 16l7 4 7-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  ];
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {icons[idx % icons.length]}
    </svg>
  );
}

/* ============================================================ */
/* CATEGORIES — horizontal scroll-jacked carousel                */
/* ============================================================ */
function Categories() {
  const { pick } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-40%']);

  return (
    <section ref={ref} className="sec relative overflow-hidden border-y border-[--color-line]">
      <div className="wrap mb-10 lg:mb-14">
        <SectionHeader
          num="03"
          tag="/ category"
          title={'O‘zingiz uchun toifani toping.'}
          sub="11 kategoriya bo‘yicha 350+ aniq formula — sizning texnikangizga moslashtirilgan."
        />
      </div>

      <motion.div style={{ x }} className="flex gap-5 px-8 will-change-transform">
        {CATEGORIES.map((c, i) => (
          <Link
            key={c.id}
            href={`/products?cat=${c.id}`}
            className="group shrink-0 w-[18rem] sm:w-[22rem] lg:w-[26rem] aspect-[4/5] relative rounded-3xl overflow-hidden border border-[--color-line] bg-gradient-to-br from-[--color-bg-2] to-[--color-bg-1]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,138,31,0.18),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 grid place-items-center">
              <img
                src={productImage({ id: c.id }, i)}
                alt={pick(c.name)}
                className="max-h-[55%] max-w-[55%] object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3"
              />
            </div>
            <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[--color-fg-3]">
                // 0{i + 1}/{CATEGORIES.length}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[--color-amber-400]">
                {c.products.length} {' '}items
              </span>
            </div>
            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 bg-gradient-to-t from-[--color-bg-0] via-[--color-bg-0]/85 to-transparent">
              <h3 className="font-display font-semibold text-xl sm:text-2xl text-[--color-fg-0] leading-tight">
                {pick(c.name)}
              </h3>
              <p className="mt-1.5 text-xs text-[--color-fg-2] line-clamp-2">{pick(c.description)}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-[--color-amber-400] font-mono text-[10px] uppercase tracking-widest">
                <span>Explore</span>
                <ArrowR />
              </div>
            </div>
          </Link>
        ))}
      </motion.div>
    </section>
  );
}

/* ============================================================ */
/* FACTORY SHOWCASE — split with video                           */
/* ============================================================ */
function FactoryShowcase() {
  const { t } = useLang();
  return (
    <section className="sec relative">
      <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-5">
          <SectionHeader
            num="04"
            tag={t('sec.factory.tag')}
            title={t('sec.factory.title')}
            sub={t('sec.factory.sub')}
            align="left"
          />
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-outline-cyan">
                {t('sec.factory.cta')}
                <ArrowR />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <ul className="mt-10 space-y-4 max-w-md">
              {[
                ['9000', t('metric.tons') + ' / ' + t('metric.production')],
                ['11', 'kategoriya'],
                ['100%', 'O‘zbekistonda ishlab chiqarilgan'],
              ].map(([v, k], i) => (
                <li key={i} className="flex items-baseline justify-between gap-4 border-b border-[--color-line] pb-3">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[--color-fg-3]">{k}</span>
                  <span className="kv-num text-2xl">{v}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.2}>
            <div className="relative aspect-[4/5] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-[--color-line] bg-[--color-bg-1]">
              <video
                src="/chilon.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40" />
              <div className="absolute top-5 left-5 right-5 flex justify-between items-start font-mono text-[10px] uppercase tracking-widest text-white/90">
                <span className="inline-flex items-center gap-2"><span className="size-1.5 rounded-full bg-[--color-amber-500] animate-pulse shadow-[0_0_10px_var(--color-amber-500)]"/>live · plant feed</span>
                <span>BEKTEMIR / TASHKENT</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/70">capacity</div>
                  <div className="display text-4xl sm:text-5xl text-white mt-1">9000T</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/70">since</div>
                  <div className="display text-4xl sm:text-5xl text-white mt-1">2013</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* PARTNERS — animated grid                                      */
/* ============================================================ */
function Partners() {
  const { t } = useLang();
  return (
    <section className="sec relative">
      <div className="wrap">
        <SectionHeader
          num="05"
          tag={t('sec.partners.tag')}
          title={t('sec.partners.title')}
          sub={t('sec.partners.sub')}
        />

        <div className="mt-12 lg:mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[--color-line] border border-[--color-line] rounded-3xl overflow-hidden">
          {PARTNERS.slice(0, 12).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.04} className="bg-[--color-bg-1]">
              <div className="group relative aspect-[4/3] grid place-items-center p-5 transition-colors hover:bg-[--color-bg-2]">
                <span className="font-display font-medium text-[--color-fg-2] text-center text-sm sm:text-base group-hover:text-[--color-amber-400] transition-colors line-clamp-2">
                  {p.name}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* NEWS — magazine layout                                        */
/* ============================================================ */
function News() {
  const { t, pick } = useLang();
  const items = NEWS.slice(0, 4);
  if (!items.length) return null;

  return (
    <section className="sec relative">
      <div className="wrap">
        <SectionHeader
          num="06"
          tag={t('sec.news.tag')}
          title={t('sec.news.title')}
          cta={{ href: '/news', label: t('sec.news.cta') }}
        />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {items[0] && (
            <Reveal className="lg:col-span-7">
              <Tilt3D intensity={4}>
                <Link href={`/news/${items[0].slug}`} className="bento block aspect-[4/3] sm:aspect-[16/10] relative overflow-hidden">
                  <img
                    src={productImage({ id: items[0].slug }, 0)}
                    alt={pick(items[0].title)}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[--color-bg-0] via-[--color-bg-0]/60 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-10">
                    <div className="rule-mono">{new Date(items[0].date).toLocaleDateString()}</div>
                    <h3 className="mt-3 display text-2xl sm:text-4xl text-[--color-fg-0] max-w-xl">
                      {pick(items[0].title)}
                    </h3>
                    <span className="arrow-link mt-5">
                      {t('news.read')} <ArrowR />
                    </span>
                  </div>
                </Link>
              </Tilt3D>
            </Reveal>
          )}

          <div className="lg:col-span-5 grid grid-cols-1 gap-4 lg:gap-6">
            {items.slice(1, 4).map((n, i) => (
              <Reveal key={n.id} delay={i * 0.1}>
                <Link
                  href={`/news/${n.slug}`}
                  className="bento block p-5 sm:p-6 flex items-center justify-between gap-4 hover:translate-x-1 transition-transform"
                >
                  <div className="flex-1 min-w-0">
                    <div className="rule-mono">{new Date(n.date).toLocaleDateString()}</div>
                    <h4 className="mt-2 font-display font-semibold text-base sm:text-lg text-[--color-fg-0] line-clamp-2 leading-snug">
                      {pick(n.title)}
                    </h4>
                  </div>
                  <span className="inline-flex shrink-0 size-10 items-center justify-center rounded-full border border-[--color-line-2] text-[--color-fg-1] group-hover:border-[--color-amber-500] group-hover:text-[--color-amber-400] transition-colors">
                    <ArrowR />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* CTA BLOCK — huge oversized call to action                     */
/* ============================================================ */
function CtaBlock() {
  const { t } = useLang();
  return (
    <section className="sec relative">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-[2rem] border border-[--color-line] bg-gradient-to-br from-[--color-bg-2] via-[--color-bg-1] to-[--color-bg-0] p-8 sm:p-14 lg:p-20">
          <div className="absolute -top-32 -right-20 w-[36rem] h-[36rem] rounded-full bg-[--color-amber-500]/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] rounded-full bg-[--color-cyan-500]/20 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <span className="chip chip-dot">/ consultation</span>
              <h2 className="mt-6 display text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95]">
                <SplitReveal text={t('sec.cta.title')} />
              </h2>
              <Reveal delay={0.3}>
                <p className="mt-5 max-w-xl text-base sm:text-lg text-[--color-fg-2]">{t('sec.cta.sub')}</p>
              </Reveal>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Magnetic strength={0.5}>
                <Link href="/contacts" className="btn btn-primary text-base !py-4 !px-7">
                  {t('sec.cta.button')}
                  <ArrowR />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* SHARED HELPERS                                                */
/* ============================================================ */
function SectionHeader({
  num, tag, title, sub, cta, align = 'between',
}: {
  num: string; tag: string; title: string; sub?: string;
  cta?: { href: string; label: string }; align?: 'between' | 'left';
}) {
  return (
    <div className={`flex flex-col ${align === 'between' ? 'lg:flex-row lg:items-end lg:justify-between' : ''} gap-6 lg:gap-8`}>
      <div className="max-w-3xl">
        <Reveal>
          <div className="flex items-center gap-3 sec-num">
            <span>{num}</span>
            <span className="block h-px w-12 bg-[--color-line-2]" />
            <span>{tag}</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display mt-5 text-[clamp(2rem,5vw,4.25rem)] leading-[0.98] text-[--color-fg-0]">
            <SplitReveal text={title} />
          </h2>
        </Reveal>
        {sub && (
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-xl text-sm sm:text-base text-[--color-fg-2] leading-relaxed">{sub}</p>
          </Reveal>
        )}
      </div>
      {cta && (
        <Reveal delay={0.25}>
          <Link href={cta.href} className="btn btn-ghost shrink-0">
            {cta.label} <ArrowR />
          </Link>
        </Reveal>
      )}
    </div>
  );
}

function ArrowR() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 6.5h9M7.5 2L11 6.5 7.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
