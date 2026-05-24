'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { CATEGORIES, NEWS, PARTNERS, PRODUCTS, productImage, findProduct } from '@/lib/data';
import { Reveal } from '@/components/Reveal';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Stats />
      <FeaturedProduct />
      <Categories />
      <Bestsellers />
      <WhyUs />
      <Manufacturing />
      <PartnersStrip />
      <Testimonials />
      <FAQ />
      <LatestNews />
      <CtaBlock />
    </div>
  );
}

/* ── HERO ──────────────────────────────────────────────── */
function Hero() {
  const { t } = useLang();
  const featured = findProduct('platinum-5w30') || PRODUCTS[0];
  const img = productImage(featured);

  return (
    <section className="relative overflow-hidden bg-[--color-paper]">
      <div className="absolute inset-0 paper-texture opacity-50 pointer-events-none" />
      <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-[--color-brand-100]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-24 w-[26rem] h-[26rem] rounded-full bg-[--color-amber-100]/45 blur-3xl pointer-events-none" />

      <div className="wrap relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-12 lg:pt-20 pb-14 lg:pb-24">
        {/* Left text */}
        <div className="lg:col-span-7">
          <Reveal>
            <span className="eyebrow">{t('hero.eyebrow')}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="display mt-5 text-[2.5rem] sm:text-5xl lg:text-[3.75rem] xl:text-6xl leading-[1.05] max-w-2xl">
              {t('hero.title')}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-xl text-base sm:text-lg text-[--color-ink-700] leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <ul className="mt-7 space-y-2.5 text-sm sm:text-base">
              {[t('hero.point1'), t('hero.point2'), t('hero.point3')].map((p, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[--color-ink-800]">
                  <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-[--color-brand-100] text-[--color-brand-700] shrink-0">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M2 5.5l2.2 2.5L9 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn btn-primary btn-lg">
                {t('cta.catalog')}
                <ArrowR />
              </Link>
              <Link href="/contacts" className="btn btn-outline btn-lg">
                {t('cta.consult')}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Right hero card */}
        <div className="lg:col-span-5">
          <Reveal delay={0.15}>
            <Link
              href={`/products/${featured?.id || ''}`}
              className="relative block rounded-2xl bg-white border border-[--color-ink-100] shadow-soft p-6 sm:p-8 transition hover:shadow-glow hover:-translate-y-1 hover:border-[--color-brand-200]"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="tag tag-amber">★ {t('hero.featured.tag')}</span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[--color-ink-500]">CHILON Platinum</span>
              </div>

              <div className="bottle-stage aspect-[4/5] w-full">
                <img
                  src={img}
                  alt={t('hero.featured.name')}
                  className="max-h-[88%] max-w-[80%] object-contain drop-shadow-[0_28px_30px_rgb(31_84_57/0.18)]"
                />
              </div>

              <div className="mt-5">
                <h3 className="font-display font-bold text-xl text-[--color-ink-900]">{t('hero.featured.name')}</h3>
                <p className="mt-1 text-sm text-[--color-ink-600]">{t('hero.featured.desc')}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="tag tag-amber">SAE 5W-30</span>
                  <span className="tag">API SP</span>
                  <span className="tag tag-neutral">100% синтетика</span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[--color-ink-100] pt-4">
                  <span className="arrow-link">
                    {t('cta.viewProduct')}
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7.5 2L11 6.5 7.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <span className="text-xs text-[--color-ink-500]">1L · 4L · 5L</span>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── STATS STRIP ──────────────────────────────────────── */
function Stats() {
  const { t } = useLang();
  return (
    <section className="bg-[--color-brand-700] text-white">
      <div className="wrap py-8 lg:py-10 grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 lg:divide-x divide-white/12">
        {[
          { v: '9 000+', k: t('stat.production') },
          { v: '350+', k: t('stat.products') },
          { v: '12+', k: t('stat.years') },
          { v: '9', k: t('stat.regions') },
        ].map((m, i) => (
          <div key={i} className="px-2 lg:px-6 first:pl-0 last:pr-0">
            <div className="display text-3xl sm:text-4xl text-white">{m.v}</div>
            <div className="mt-1 text-xs sm:text-sm text-white/70 leading-snug">{m.k}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── FEATURED PRODUCT (large split) ─────────────────────── */
function FeaturedProduct() {
  const { t } = useLang();
  const p = findProduct('platinum-5w30') || PRODUCTS[0];
  const img = productImage(p);

  return (
    <section className="sec">
      <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <Reveal className="lg:col-span-6 order-2 lg:order-1">
          <span className="eyebrow">{t('sec.featured.title')}</span>
          <h2 className="display mt-3 text-3xl sm:text-4xl lg:text-5xl leading-[1.08]">
            {t('hero.featured.name')}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[--color-ink-700] leading-relaxed max-w-xl">
            {t('sec.featured.sub')}
          </p>

          <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              t('products.adv.1'),
              t('products.adv.2'),
              t('products.adv.3'),
              t('products.adv.4'),
            ].map((adv, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[--color-ink-800]">
                <span className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-[--color-brand-100] text-[--color-brand-700] shrink-0">
                  <svg width="10" height="10" viewBox="0 0 11 11" fill="none">
                    <path d="M2 5.5l2.2 2.5L9 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {adv}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={`/products/${p?.id || ''}`} className="btn btn-primary">{t('cta.viewProduct')}<ArrowR /></Link>
            <Link href="/contacts" className="btn btn-outline">{t('cta.requestFull')}</Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {['SAE 5W-30', 'API SP', 'ACEA C3', 'ILSAC GF-6A'].map((c) => (
              <span key={c} className="tag tag-neutral">{c}</span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6 order-1 lg:order-2">
          <div className="relative bg-gradient-to-br from-[--color-cream] to-[--color-paper] rounded-3xl border border-[--color-ink-100] overflow-hidden aspect-square">
            <div className="absolute inset-0 paper-texture opacity-40" />
            <div className="absolute -top-12 -right-12 size-64 rounded-full bg-[--color-amber-100]/60 blur-2xl" />
            <div className="relative h-full w-full bottle-stage">
              <img src={img} alt={p?.name || ''} className="max-h-[78%] max-w-[78%] object-contain drop-shadow-[0_40px_40px_rgb(31_84_57/0.18)]" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-[--color-ink-500] font-medium">
              <span>{t('products.packaging')}</span>
              <span>1L · 4L · 5L · 20L · 200L</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── CATEGORIES ──────────────────────────────────────────── */
function Categories() {
  const { t, pick } = useLang();
  const cats = CATEGORIES.slice(0, 8);
  return (
    <section className="sec bg-[--color-cream]">
      <div className="wrap">
        <SectionHead
          eyebrow={t('sec.cats.eyebrow')}
          title={t('sec.cats.title')}
          sub={t('sec.cats.sub')}
          cta={{ href: '/products', label: t('cta.allProducts') }}
        />

        <div className="mt-10 lg:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {cats.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.04}>
              <Link
                href={`/products?cat=${c.id}`}
                className="group block bg-white rounded-xl border border-[--color-ink-100] overflow-hidden hover:border-[--color-brand-300] hover:shadow-glow transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] bg-gradient-to-br from-[--color-paper] to-[--color-cream] overflow-hidden grid place-items-center">
                  <img
                    src={productImage({ id: c.id }, i)}
                    alt={pick(c.name)}
                    className="max-h-[72%] max-w-[68%] object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2 drop-shadow-md"
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs text-[--color-ink-500] mb-1">{c.products.length} mahsulot</div>
                  <h3 className="font-display font-semibold text-[--color-ink-900] text-sm sm:text-base leading-snug line-clamp-2">
                    {pick(c.name)}
                  </h3>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── BESTSELLERS ──────────────────────────────────────────── */
function Bestsellers() {
  const { t } = useLang();
  const featured = PRODUCTS.filter((p) => p.tier === 'premium' || /platinum|aurum/i.test(p.name)).slice(0, 8);
  const list = featured.length >= 4 ? featured : PRODUCTS.slice(0, 8);
  return (
    <section className="sec">
      <div className="wrap">
        <SectionHead
          eyebrow={t('cta.catalog')}
          title="Eng ko‘p sotiladigan mahsulotlar"
          cta={{ href: '/products', label: t('cta.viewAll') }}
        />
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {list.slice(0, 8).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.03}>
              <ProductCard product={p} idx={i} showApplications={false} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── WHY US ─────────────────────────────────────────────── */
function WhyUs() {
  const { t } = useLang();
  const items = [1, 2, 3, 4, 5, 6].map((n) => ({
    t: t(`sec.why.${n}.t`),
    d: t(`sec.why.${n}.d`),
  }));
  return (
    <section className="sec bg-[--color-cream]">
      <div className="wrap">
        <SectionHead
          eyebrow={t('sec.why.eyebrow')}
          title={t('sec.why.title')}
          sub={t('sec.why.sub')}
        />
        <div className="mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="card p-6 sm:p-7 h-full hover:border-[--color-brand-200] transition-colors">
                <span className="inline-flex size-12 items-center justify-center rounded-lg bg-[--color-brand-50] text-[--color-brand-700]">
                  <WhyIcon i={i} />
                </span>
                <h3 className="mt-5 font-display font-semibold text-lg text-[--color-ink-900]">{it.t}</h3>
                <p className="mt-2 text-sm text-[--color-ink-600] leading-relaxed">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── MANUFACTURING ──────────────────────────────────────── */
function Manufacturing() {
  const { t } = useLang();
  return (
    <section className="sec">
      <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <Reveal className="lg:col-span-6">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[--color-ink-100] shadow-soft bg-[--color-cream]">
            <video
              src="/chilon.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[--color-brand-900]/40 via-transparent to-transparent" />
            <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-md bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-medium text-[--color-ink-900]">
              <span className="size-1.5 rounded-full bg-[--color-amber-500] animate-pulse" />
              Toshkent / Bektemir tumani
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6">
          <span className="eyebrow">{t('sec.mfg.eyebrow')}</span>
          <h2 className="display mt-3 text-3xl sm:text-4xl lg:text-5xl leading-[1.08]">{t('sec.mfg.title')}</h2>
          <p className="mt-4 text-base sm:text-lg text-[--color-ink-700] leading-relaxed">{t('sec.mfg.sub')}</p>

          <div className="mt-7 space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-start gap-4 pb-4 border-b border-[--color-ink-100] last:border-0">
                <span className="size-10 shrink-0 grid place-items-center rounded-md bg-[--color-amber-50] text-[--color-amber-700] font-display font-bold">
                  {n.toString().padStart(2, '0')}
                </span>
                <div>
                  <h4 className="font-display font-semibold text-[--color-ink-900] text-base">{t(`sec.mfg.b${n}.t`)}</h4>
                  <p className="mt-1 text-sm text-[--color-ink-600]">{t(`sec.mfg.b${n}.d`)}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/about" className="btn btn-outline mt-7">{t('cta.details')}<ArrowR /></Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ── PARTNERS STRIP ──────────────────────────────────────── */
function PartnersStrip() {
  const { t } = useLang();
  const list = PARTNERS.slice(0, 12);
  return (
    <section className="sec bg-[--color-cream]">
      <div className="wrap text-center">
        <span className="eyebrow before:hidden! justify-center!">{t('sec.partners.eyebrow')}</span>
        <h2 className="display mt-3 text-3xl sm:text-4xl lg:text-5xl">{t('sec.partners.title')}</h2>
        <p className="mt-4 max-w-2xl mx-auto text-base text-[--color-ink-700]">{t('sec.partners.sub')}</p>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[--color-ink-100] rounded-2xl overflow-hidden border border-[--color-ink-100] shadow-soft">
          {list.map((p) => (
            <div key={p.id} className="bg-white aspect-[4/2.5] grid place-items-center p-5 hover:bg-[--color-paper] transition-colors">
              <span className="font-display font-semibold text-sm sm:text-base text-[--color-ink-700] text-center line-clamp-2">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ──────────────────────────────────────── */
function Testimonials() {
  const { t } = useLang();
  return (
    <section className="sec">
      <div className="wrap">
        <SectionHead
          eyebrow={t('sec.testimonial.eyebrow')}
          title={t('sec.testimonial.title')}
        />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((n, i) => (
            <Reveal key={n} delay={i * 0.05}>
              <figure className="card p-6 sm:p-7 h-full flex flex-col">
                <div className="flex text-[--color-amber-500] mb-4" aria-hidden>
                  {Array.from({ length: 5 }).map((_, k) => (
                    <svg key={k} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1l2 4.6 5 .5-3.8 3.4 1.2 4.9L8 11.7l-4.4 2.7 1.2-4.9L1 6.1l5-.5z"/>
                    </svg>
                  ))}
                </div>
                <blockquote className="text-[--color-ink-800] text-base leading-relaxed flex-1">
                  “{t(`sec.testimonial.${n}.text`)}”
                </blockquote>
                <figcaption className="mt-5 pt-5 border-t border-[--color-ink-100] flex items-center gap-3">
                  <div className="size-10 rounded-full bg-[--color-brand-100] grid place-items-center font-display font-bold text-[--color-brand-700]">
                    {t(`sec.testimonial.${n}.author`).split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-sm text-[--color-ink-900]">{t(`sec.testimonial.${n}.author`)}</div>
                    <div className="text-xs text-[--color-ink-500]">{t(`sec.testimonial.${n}.role`)}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────── */
function FAQ() {
  const { t } = useLang();
  return (
    <section className="sec bg-[--color-cream]">
      <div className="wrap grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-5">
          <span className="eyebrow">{t('sec.faq.eyebrow')}</span>
          <h2 className="display mt-3 text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">{t('sec.faq.title')}</h2>
          <p className="mt-5 text-base text-[--color-ink-700]">
            Eng ko‘p so‘raladigan savollarga javoblar. Boshqa savol bo‘lsa, biz bilan bog‘laning.
          </p>
          <Link href="/contacts" className="btn btn-primary mt-7">{t('cta.consult')}<ArrowR /></Link>
        </div>

        <div className="lg:col-span-7">
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <details key={n} className="card p-5 sm:p-6 hover:border-[--color-brand-200] transition-colors">
                <summary className="flex items-center justify-between gap-4">
                  <span className="font-display font-semibold text-base sm:text-lg text-[--color-ink-900]">
                    {t(`sec.faq.${n}.q`)}
                  </span>
                  <span className="faq-chev inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-[--color-cream] text-[--color-brand-700]">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-sm sm:text-base text-[--color-ink-700] leading-relaxed">
                  {t(`sec.faq.${n}.a`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── LATEST NEWS ─────────────────────────────────────────── */
function LatestNews() {
  const { t, pick, lang } = useLang();
  const items = NEWS.slice(0, 3);
  if (!items.length) return null;

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <section className="sec">
      <div className="wrap">
        <SectionHead
          eyebrow={t('sec.news.eyebrow')}
          title={t('sec.news.title')}
          cta={{ href: '/news', label: t('cta.viewAll') }}
        />
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((n, i) => (
            <Reveal key={n.id} delay={i * 0.05}>
              <Link
                href={`/news/${n.slug}`}
                className="card card-hover overflow-hidden h-full flex flex-col"
              >
                <div className="aspect-[16/10] bg-gradient-to-br from-[--color-paper] to-[--color-cream] grid place-items-center overflow-hidden">
                  <img
                    src={productImage({ id: n.slug }, i)}
                    alt={pick(n.title)}
                    className="max-h-[75%] max-w-[70%] object-contain transition-transform duration-500 hover:scale-105 drop-shadow-md"
                  />
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <div className="text-xs text-[--color-ink-500] mb-2">{fmt(n.date)}</div>
                  <h3 className="font-display font-semibold text-base sm:text-lg text-[--color-ink-900] leading-snug line-clamp-3 flex-1">
                    {pick(n.title)}
                  </h3>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[--color-brand-700]">
                    {t('news.read')}
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5h7M6.5 2L9 5.5 6.5 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ──────────────────────────────────────────────── */
function CtaBlock() {
  const { t } = useLang();
  return (
    <section className="sec">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-3xl bg-[--color-brand-700] text-white p-8 sm:p-12 lg:p-16">
          <div className="absolute -top-20 -right-20 size-80 rounded-full bg-[--color-amber-500]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-[--color-brand-500]/40 blur-3xl pointer-events-none" />
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2 className="display text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.08]">{t('sec.cta.title')}</h2>
              <p className="mt-4 max-w-2xl text-base sm:text-lg text-white/85">{t('sec.cta.sub')}</p>
            </div>
            <div className="lg:col-span-4 flex flex-wrap gap-3 lg:justify-end">
              <Link href="/contacts" className="btn btn-accent btn-lg">{t('cta.consult')}<ArrowR /></Link>
              <Link href="/products" className="btn btn-ghost text-white! border-white/30! border! btn-lg hover:bg-white/10!">{t('cta.catalog')}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── HELPERS ────────────────────────────────────────────── */
function SectionHead({
  eyebrow,
  title,
  sub,
  cta,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
      <div className="max-w-2xl">
        <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>
        <Reveal delay={0.05}>
          <h2 className="display mt-3 text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">{title}</h2>
        </Reveal>
        {sub && (
          <Reveal delay={0.1}>
            <p className="mt-4 text-base text-[--color-ink-700] leading-relaxed">{sub}</p>
          </Reveal>
        )}
      </div>
      {cta && (
        <Reveal delay={0.12}>
          <Link href={cta.href} className="btn btn-outline shrink-0">{cta.label}<ArrowR /></Link>
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

function WhyIcon({ i }: { i: number }) {
  const paths = [
    <path key="0" d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z M8.5 12l2.5 2.5L16 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    <path key="1" d="M3 19V9l9-6 9 6v10H3z M9 19v-6h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    <path key="2" d="M3 7h11v8H3zM14 9h3l3 3v3h-6zM7 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM18 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    <path key="3" d="M12 3a4 4 0 0 1 4 4v3l1 8H7l1-8V7a4 4 0 0 1 4-4zM10 19v1a2 2 0 0 0 4 0v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    <path key="4" d="M3 7h18v12H3zM3 11h18M7 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    <path key="5" d="M5 7l7-4 7 4-7 4-7-4z M5 12l7 4 7-4M5 17l7 4 7-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  ];
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">{paths[i % paths.length]}</svg>
  );
}
