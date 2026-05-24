'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Lang, Localized } from './types';

export const LANGS: Lang[] = ['uz', 'en', 'ru'];
export const DEFAULT_LANG: Lang = 'uz';
const STORAGE_KEY = 'chilon2_lang';

type Dict = Record<string, string>;

const STRINGS: Record<Lang, Dict> = {
  uz: {
    'brand.full': 'Chilon Lubricants',
    'nav.home': 'Bosh sahifa',
    'nav.about': 'Kompaniya',
    'nav.products': 'Mahsulotlar',
    'nav.partners': 'Hamkorlar',
    'nav.news': 'Yangiliklar',
    'nav.contacts': 'Aloqa',
    'nav.menu': 'Menyu',
    'nav.close': 'Yopish',

    'top.phone': 'Buyurtma uchun',
    'top.delivery': 'O\'zbekiston bo\'ylab yetkazib berish',
    'top.workhours': 'Du–Ju 9:00–18:00',

    'cta.consult': 'Bepul maslahat',
    'cta.catalog': 'Katalog',
    'cta.request': 'Narx so\'rash',
    'cta.requestFull': 'Narxni so\'rash',
    'cta.callback': 'Qo\'ng\'iroqni buyurtma qilish',
    'cta.details': 'Batafsil',
    'cta.viewAll': 'Hammasini ko\'rish',
    'cta.viewProduct': 'Mahsulotni ko\'rish',
    'cta.allProducts': 'Barcha mahsulotlar',

    'hero.eyebrow': '2013-yildan beri ishonchli moylash mahsulotlari',
    'hero.title': 'Texnikangiz uchun ishonchli moylash mahsulotlari.',
    'hero.subtitle': 'Chilon Lubricants — Toshkentdagi yetakchi moylash materiallari zavodi. Avtomobillar, sanoat va temir yo\'l texnikasi uchun 350+ tur mahsulot.',
    'hero.point1': 'Xalqaro standartlar bo\'yicha sertifikatlangan',
    'hero.point2': 'Yiliga 9000+ tonna ishlab chiqarish quvvati',
    'hero.point3': 'Barcha viloyatlar bo\'ylab yetkazib berish',
    'hero.featured.tag': 'Yangi mavsumiy taklif',
    'hero.featured.name': 'CHILON Platinum 5W-30',
    'hero.featured.desc': 'Yengil avtomobillar uchun premium sintetik motor moyi.',

    'stat.production': 'tonna yillik ishlab chiqarish',
    'stat.products': 'tur mahsulot',
    'stat.years': 'yillik tajriba',
    'stat.regions': 'mintaqaviy dilerlar',

    'sec.featured.title': 'Mavsumiy taklif',
    'sec.featured.sub': 'Yangi avlod premium sintetik motor moyi — barcha ob\'havo sharoitlari uchun.',

    'sec.cats.eyebrow': 'Mahsulot kategoriyalari',
    'sec.cats.title': 'Har bir texnika uchun aniq formula',
    'sec.cats.sub': '11 kategoriya, 350+ tur. Avtomobillardan to sanoat uskunalarigacha bo\'lgan barcha ehtiyojlaringizni qondiramiz.',

    'sec.why.eyebrow': 'Nima uchun Chilon',
    'sec.why.title': 'Sifat — bizning birinchi tamoyilimiz',
    'sec.why.sub': 'O\'zbekistonda ishlab chiqarilgan, jahon standartlariga mos premium mahsulotlar.',
    'sec.why.1.t': 'Xalqaro sifat',
    'sec.why.1.d': 'API, ACEA, ILSAC va JASO standartlariga mos keluvchi formulalar.',
    'sec.why.2.t': 'Mahalliy ishlab chiqarish',
    'sec.why.2.d': '100% O\'zbekistonda — Bektemir tumanidagi zamonaviy zavodda ishlab chiqariladi.',
    'sec.why.3.t': 'Tezkor yetkazib berish',
    'sec.why.3.d': 'Toshkent va barcha viloyatlardagi dilerlar tarmog\'i orqali 24 soat ichida.',
    'sec.why.4.t': 'Texnik qo\'llab-quvvatlash',
    'sec.why.4.d': 'Texnikangizga aniq mos keladigan mahsulotni tanlashda mutaxassislarimiz yordam beradi.',
    'sec.why.5.t': 'Optom narxlar',
    'sec.why.5.d': 'B2B mijozlar uchun maxsus shartlar va doimiy chegirmalar.',
    'sec.why.6.t': 'Sertifikatlangan',
    'sec.why.6.d': 'ISO 9001 va ISO 14001 bo\'yicha sifat va ekologiya sertifikatlari.',

    'sec.mfg.eyebrow': 'Bizning zavod',
    'sec.mfg.title': 'Toshkentdagi yuqori texnologiyali ishlab chiqarish',
    'sec.mfg.sub': '2013-yilda ishga tushirilgan zavod O\'zbekistondagi import o\'rnini bosish dasturining flagman loyihasi hisoblanadi.',
    'sec.mfg.b1.t': 'Avtomatlashtirilgan liniya',
    'sec.mfg.b1.d': 'Yevropa uskunalari, 12 bosqichli sintez jarayoni.',
    'sec.mfg.b2.t': 'Laboratoriya nazorati',
    'sec.mfg.b2.d': 'Har bir partiya kirish va chiqishda sinovdan o\'tkaziladi.',
    'sec.mfg.b3.t': 'Quvvat 9000+ tonna',
    'sec.mfg.b3.d': 'Yillik ishlab chiqarish hajmi O\'zbekiston ehtiyojlarini qondiradi.',

    'sec.partners.eyebrow': 'Hamkorlar',
    'sec.partners.title': 'Bizga sanoat yetakchilari ishonadi',
    'sec.partners.sub': 'O\'zbekiston temir yo\'llari, GM Uzbekistan, KamAZ va o\'nlab boshqa brendlar.',

    'sec.testimonial.eyebrow': 'Mijozlar fikri',
    'sec.testimonial.title': 'Bizning ishimiz haqida',
    'sec.testimonial.1.text': 'Chilon mahsulotlari sifati va narxi bo\'yicha bozorda eng yaxshi taklif. Bir necha yildan beri faqat shu brendni ishlatamiz.',
    'sec.testimonial.1.author': 'Anvar Karimov',
    'sec.testimonial.1.role': 'Avtomexanik, Toshkent',
    'sec.testimonial.2.text': 'B2B bo\'limi bilan ishlash juda qulay. Tezkor yetkazib berish va doimiy texnik qo\'llab-quvvatlash.',
    'sec.testimonial.2.author': 'Dilshod Yusupov',
    'sec.testimonial.2.role': 'Xarid menejeri',
    'sec.testimonial.3.text': 'Bizning yuk avtomobillari parki uchun ideal yechim. Yuqori sifat, uzoq xizmat muddati.',
    'sec.testimonial.3.author': 'Sherzod Rahimov',
    'sec.testimonial.3.role': 'Avtopark boshlig\'i',

    'sec.faq.eyebrow': 'Tez-tez beriladigan savollar',
    'sec.faq.title': 'Tanlashda yordam kerakmi?',
    'sec.faq.1.q': 'Avtomobilim uchun qaysi moyni tanlash kerak?',
    'sec.faq.1.a': 'Mahsulotni avtomobilingiz ishlab chiqaruvchisining tavsiyalariga, SAE viskozitet sinfiga va API spetsifikatsiyasiga ko\'ra tanlang. Mutaxassislarimiz bilan bepul maslahatlashing.',
    'sec.faq.2.q': 'Moyni qachon almashtirish kerak?',
    'sec.faq.2.a': 'Standart ravishda har 10 000 km da yoki yiliga bir marta. Premium sintetik moylar uchun 15 000 km gacha. Aniq interval avtomobil yo\'riqnomasida ko\'rsatilgan.',
    'sec.faq.3.q': 'Sintetik va mineral moyning farqi nima?',
    'sec.faq.3.a': 'Sintetik moylar zavodda sintez qilinadi va ekstremal harorat oralig\'ida barqaror ishlaydi. Mineral moylar arzonroq, lekin xizmat muddati qisqaroq.',
    'sec.faq.4.q': 'Optom buyurtma berish mumkinmi?',
    'sec.faq.4.a': 'Ha. B2B savdo bo\'limimiz korxonalar, avto-servislar va dilerlar uchun maxsus shartlarda ishlaydi. Aloqa bo\'limi orqali bog\'laning.',

    'sec.news.eyebrow': 'Yangiliklar',
    'sec.news.title': 'Kompaniya yangiliklari',

    'sec.cta.title': 'Sizning loyihangiz uchun aniq formulani topamiz',
    'sec.cta.sub': 'Texnik xususiyatlaringizni yuboring — mutaxassislarimiz 24 soat ichida sizga eng mos mahsulotni tavsiya qiladi.',

    'products.title': 'Mahsulotlar katalogi',
    'products.sub': '{n} ta mahsulot · barcha kategoriyalar',
    'products.all': 'Barcha kategoriyalar',
    'products.search': 'Mahsulot nomi yoki kodi bo\'yicha izlash',
    'products.empty': 'Hech narsa topilmadi',
    'products.empty.sub': 'Filtrlarni o\'zgartirib qaytadan urinib ko\'ring.',
    'products.reset': 'Filtrlarni tozalash',
    'products.found': 'topildi',
    'products.sort': 'Saralash',
    'products.sort.default': 'Standart',
    'products.sort.az': 'Nom (A–Z)',
    'products.sort.za': 'Nom (Z–A)',
    'products.view.grid': 'Karta',
    'products.view.list': 'Ro\'yxat',
    'products.filters': 'Filtrlar',
    'products.viscosity': 'Viskozitet (SAE)',
    'products.type': 'Tur',
    'products.code': 'Kod',
    'products.applications': 'Qo\'llanilishi',
    'products.specs': 'Texnik xususiyatlar',
    'products.related': 'Bog\'liq mahsulotlar',
    'products.back': 'Katalogga qaytish',
    'products.packaging': 'Qadoqlash',
    'products.packagingSizes': '1L · 4L · 5L · 20L · 200L',
    'products.advantages': 'Asosiy afzalliklari',
    'products.adv.1': 'Yuqori indeksli sintetik baza',
    'products.adv.2': 'Ekstremal haroratga chidamli',
    'products.adv.3': 'Uzaytirilgan xizmat muddati',
    'products.adv.4': 'Dvigatel detallarini himoyalash',
    'products.share': 'Ulashish',

    'news.back': 'Yangiliklarga qaytish',
    'news.read': 'O\'qish',
    'news.related': 'Boshqa yangiliklar',

    'about.eyebrow': 'Biz haqimizda',
    'about.title': 'O\'zbekistondagi yetakchi moylash zavodi.',
    'about.sub': 'Sifat va innovatsiyaga asoslangan, 2013-yildan beri butun mintaqaga xizmat ko\'rsatamiz.',
    'about.mission.eyebrow': 'Bizning missiya',
    'about.mission.title': 'O\'zbekiston sanoatini sifatli moylash mahsulotlari bilan ta\'minlash.',
    'about.mission.body': 'Biz O\'zbekiston bozorida import mahsulotlarga muqobil sifatida mahalliy ishlab chiqarilgan, lekin xalqaro standartlarga mos premium darajadagi moylash materiallarini taqdim etamiz. Har bir formulamiz xalqaro standartlar bo\'yicha sertifikatlangan.',
    'about.history.eyebrow': 'Tarix',
    'about.history.title': 'Bizning yo\'l',
    'about.values.eyebrow': 'Qadriyatlar',
    'about.values.title': 'Bizni shakllantirgan tamoyillar',
    'about.certs.eyebrow': 'Sertifikatlar',
    'about.certs.title': 'Xalqaro sifat tasdig\'i',
    'about.certs.list': 'ISO 9001 · ISO 14001 · API · ACEA · JASO · GOST',

    'partners.title': 'Hamkorlar tarmog\'i',
    'partners.sub': 'Dunyo bo\'ylab ishonchli brendlar bilan birgalikda. Ishlab chiqarish va distribyutsiya bo\'yicha 50+ rasmiy hamkor.',
    'partners.become': 'Hamkor bo\'lish',
    'partners.becomeSub': 'Bizning dilerlar tarmog\'iga qo\'shilishni xohlaysizmi? Aloqa bo\'limi orqali bog\'laning.',

    'contacts.title': 'Aloqa',
    'contacts.sub': 'Savollaringizga 24 soat ichida javob beramiz. Texnik maslahat va narxlar uchun bog\'laning.',
    'contacts.departments': 'Bo\'limlar',
    'contacts.dealers': 'Mintaqaviy dilerlar',
    'contacts.address': 'Manzil',
    'contacts.email': 'Elektron pochta',
    'contacts.hours': 'Ish vaqti',
    'contacts.form.title': 'Bog\'lanish shakli',
    'contacts.form.sub': 'Formani to\'ldiring va biz tez orada siz bilan bog\'lanamiz.',
    'contacts.form.name': 'Ismingiz',
    'contacts.form.phone': 'Telefon raqamingiz',
    'contacts.form.email': 'Elektron pochta',
    'contacts.form.message': 'Sizning so\'rovingiz',
    'contacts.form.send': 'Yuborish',
    'contacts.form.ok': 'Rahmat! So\'rovingiz qabul qilindi. Tez orada bog\'lanamiz.',

    'footer.tagline': 'O\'zbekistondagi yetakchi moylash mahsulotlari ishlab chiqaruvchisi.',
    'footer.nav': 'Navigatsiya',
    'footer.catalog': 'Katalog',
    'footer.contacts': 'Aloqa',
    'footer.rights': 'Barcha huquqlar himoyalangan.',
    'footer.madeIn': 'O\'zbekistonda ishlab chiqarilgan',
    'footer.privacy': 'Maxfiylik siyosati',
    'footer.terms': 'Foydalanish shartlari',
  },

  en: {
    'brand.full': 'Chilon Lubricants',
    'nav.home': 'Home',
    'nav.about': 'Company',
    'nav.products': 'Products',
    'nav.partners': 'Partners',
    'nav.news': 'News',
    'nav.contacts': 'Contacts',
    'nav.menu': 'Menu',
    'nav.close': 'Close',

    'top.phone': 'For orders',
    'top.delivery': 'Delivery across Uzbekistan',
    'top.workhours': 'Mon–Fri 9:00–18:00',

    'cta.consult': 'Free consultation',
    'cta.catalog': 'Catalog',
    'cta.request': 'Get a quote',
    'cta.requestFull': 'Request price',
    'cta.callback': 'Request a callback',
    'cta.details': 'Details',
    'cta.viewAll': 'View all',
    'cta.viewProduct': 'View product',
    'cta.allProducts': 'All products',

    'hero.eyebrow': 'Trusted lubricants since 2013',
    'hero.title': 'Reliable lubrication for your equipment.',
    'hero.subtitle': 'Chilon Lubricants is Tashkent\'s leading lubricant manufacturer. 350+ products for automotive, industrial and railway machinery.',
    'hero.point1': 'Certified to international standards',
    'hero.point2': '9 000+ tons annual production capacity',
    'hero.point3': 'Delivery to every region of Uzbekistan',
    'hero.featured.tag': 'New seasonal offer',
    'hero.featured.name': 'CHILON Platinum 5W-30',
    'hero.featured.desc': 'Premium synthetic motor oil for passenger cars.',

    'stat.production': 'tons annual production',
    'stat.products': 'product variants',
    'stat.years': 'years experience',
    'stat.regions': 'regional dealers',

    'sec.featured.title': 'Seasonal offer',
    'sec.featured.sub': 'A new-generation premium synthetic motor oil — for any weather.',

    'sec.cats.eyebrow': 'Product categories',
    'sec.cats.title': 'The right formula for every machine',
    'sec.cats.sub': '11 categories, 350+ variants. From passenger cars to industrial equipment — we cover the full range.',

    'sec.why.eyebrow': 'Why Chilon',
    'sec.why.title': 'Quality is our first principle',
    'sec.why.sub': 'Premium lubricants produced in Uzbekistan and certified to international standards.',
    'sec.why.1.t': 'International quality',
    'sec.why.1.d': 'Formulations meeting API, ACEA, ILSAC and JASO standards.',
    'sec.why.2.t': 'Local production',
    'sec.why.2.d': '100% manufactured in Uzbekistan, at our modern plant in Bektemir district.',
    'sec.why.3.t': 'Fast delivery',
    'sec.why.3.d': 'Within 24 hours through our network of dealers in Tashkent and every region.',
    'sec.why.4.t': 'Technical support',
    'sec.why.4.d': 'Our experts help you choose the exact product for your equipment.',
    'sec.why.5.t': 'Wholesale pricing',
    'sec.why.5.d': 'Special terms and ongoing discounts for B2B customers.',
    'sec.why.6.t': 'Fully certified',
    'sec.why.6.d': 'ISO 9001 and ISO 14001 certifications for quality and ecology.',

    'sec.mfg.eyebrow': 'Our plant',
    'sec.mfg.title': 'A high-tech production facility in Tashkent',
    'sec.mfg.sub': 'Launched in 2013, our plant is the flagship project of Uzbekistan\'s import-substitution program.',
    'sec.mfg.b1.t': 'Automated line',
    'sec.mfg.b1.d': 'European equipment with a 12-stage synthesis process.',
    'sec.mfg.b2.t': 'Laboratory control',
    'sec.mfg.b2.d': 'Every batch is tested on input and output.',
    'sec.mfg.b3.t': '9 000+ ton capacity',
    'sec.mfg.b3.d': 'Annual output covers the needs of the Uzbek market.',

    'sec.partners.eyebrow': 'Partners',
    'sec.partners.title': 'Trusted by industry leaders',
    'sec.partners.sub': 'Uzbekistan Railways, GM Uzbekistan, KamAZ and dozens of other brands.',

    'sec.testimonial.eyebrow': 'Customer voices',
    'sec.testimonial.title': 'What customers say',
    'sec.testimonial.1.text': 'Chilon offers the best balance of quality and price on the market. We\'ve been using only this brand for years.',
    'sec.testimonial.1.author': 'Anvar Karimov',
    'sec.testimonial.1.role': 'Auto mechanic, Tashkent',
    'sec.testimonial.2.text': 'Working with the B2B team is smooth. Fast delivery and constant technical support.',
    'sec.testimonial.2.author': 'Dilshod Yusupov',
    'sec.testimonial.2.role': 'Procurement manager',
    'sec.testimonial.3.text': 'Ideal solution for our truck fleet. High quality and long service life.',
    'sec.testimonial.3.author': 'Sherzod Rahimov',
    'sec.testimonial.3.role': 'Fleet director',

    'sec.faq.eyebrow': 'Frequently asked questions',
    'sec.faq.title': 'Need help choosing?',
    'sec.faq.1.q': 'Which oil should I pick for my car?',
    'sec.faq.1.a': 'Choose based on the manufacturer recommendation, SAE viscosity grade and API specification. Our experts will help you for free.',
    'sec.faq.2.q': 'How often should I change the oil?',
    'sec.faq.2.a': 'Standard: every 10 000 km or once a year. For premium synthetics — up to 15 000 km. Exact interval is in the vehicle manual.',
    'sec.faq.3.q': 'What\'s the difference between synthetic and mineral oils?',
    'sec.faq.3.a': 'Synthetics are produced through factory synthesis and stay stable across extreme temperatures. Mineral oils are cheaper but have a shorter service life.',
    'sec.faq.4.q': 'Can I order in bulk?',
    'sec.faq.4.a': 'Yes. Our B2B sales team works with businesses, workshops and dealers on special terms.',

    'sec.news.eyebrow': 'News',
    'sec.news.title': 'Company updates',

    'sec.cta.title': 'We\'ll pick the exact formula for your project',
    'sec.cta.sub': 'Send your technical requirements — our experts will recommend the best fit within 24 hours.',

    'products.title': 'Product catalog',
    'products.sub': '{n} products · all categories',
    'products.all': 'All categories',
    'products.search': 'Search by product name or code',
    'products.empty': 'Nothing found',
    'products.empty.sub': 'Try changing the filters.',
    'products.reset': 'Clear filters',
    'products.found': 'found',
    'products.sort': 'Sort',
    'products.sort.default': 'Default',
    'products.sort.az': 'Name (A–Z)',
    'products.sort.za': 'Name (Z–A)',
    'products.view.grid': 'Grid',
    'products.view.list': 'List',
    'products.filters': 'Filters',
    'products.viscosity': 'Viscosity (SAE)',
    'products.type': 'Type',
    'products.code': 'Code',
    'products.applications': 'Applications',
    'products.specs': 'Specifications',
    'products.related': 'Related products',
    'products.back': 'Back to catalog',
    'products.packaging': 'Packaging',
    'products.packagingSizes': '1L · 4L · 5L · 20L · 200L',
    'products.advantages': 'Key advantages',
    'products.adv.1': 'High-VI synthetic base',
    'products.adv.2': 'Stable across extreme temperatures',
    'products.adv.3': 'Extended drain intervals',
    'products.adv.4': 'Protection for engine internals',
    'products.share': 'Share',

    'news.back': 'Back to news',
    'news.read': 'Read article',
    'news.related': 'Other stories',

    'about.eyebrow': 'About us',
    'about.title': 'Uzbekistan\'s leading lubricant plant.',
    'about.sub': 'Built on quality and innovation — serving the region since 2013.',
    'about.mission.eyebrow': 'Our mission',
    'about.mission.title': 'Supply Uzbekistan industry with quality lubricants.',
    'about.mission.body': 'We deliver premium lubricants manufactured locally as an alternative to imported brands — every product certified to international standards.',
    'about.history.eyebrow': 'History',
    'about.history.title': 'Our journey',
    'about.values.eyebrow': 'Values',
    'about.values.title': 'Principles that shape us',
    'about.certs.eyebrow': 'Certifications',
    'about.certs.title': 'International quality stamp',
    'about.certs.list': 'ISO 9001 · ISO 14001 · API · ACEA · JASO · GOST',

    'partners.title': 'Partner network',
    'partners.sub': 'Working with trusted brands across the world. 50+ official partners in manufacturing and distribution.',
    'partners.become': 'Become a partner',
    'partners.becomeSub': 'Want to join our dealer network? Contact our team.',

    'contacts.title': 'Get in touch',
    'contacts.sub': 'We respond to any inquiry within 24 hours. Contact us for technical advice and pricing.',
    'contacts.departments': 'Departments',
    'contacts.dealers': 'Regional dealers',
    'contacts.address': 'Address',
    'contacts.email': 'Email',
    'contacts.hours': 'Working hours',
    'contacts.form.title': 'Contact form',
    'contacts.form.sub': 'Fill out the form and we\'ll get back to you shortly.',
    'contacts.form.name': 'Your name',
    'contacts.form.phone': 'Your phone',
    'contacts.form.email': 'Email',
    'contacts.form.message': 'Your inquiry',
    'contacts.form.send': 'Send',
    'contacts.form.ok': 'Thank you! Your request was received. We will contact you shortly.',

    'footer.tagline': 'Uzbekistan\'s leading lubricant manufacturer.',
    'footer.nav': 'Navigate',
    'footer.catalog': 'Catalog',
    'footer.contacts': 'Contacts',
    'footer.rights': 'All rights reserved.',
    'footer.madeIn': 'Made in Uzbekistan',
    'footer.privacy': 'Privacy policy',
    'footer.terms': 'Terms of use',
  },

  ru: {
    'brand.full': 'Chilon Lubricants',
    'nav.home': 'Главная',
    'nav.about': 'Компания',
    'nav.products': 'Продукция',
    'nav.partners': 'Партнёры',
    'nav.news': 'Новости',
    'nav.contacts': 'Контакты',
    'nav.menu': 'Меню',
    'nav.close': 'Закрыть',

    'top.phone': 'Для заказа',
    'top.delivery': 'Доставка по всему Узбекистану',
    'top.workhours': 'Пн–Пт 9:00–18:00',

    'cta.consult': 'Бесплатная консультация',
    'cta.catalog': 'Каталог',
    'cta.request': 'Запросить цену',
    'cta.requestFull': 'Запросить стоимость',
    'cta.callback': 'Заказать звонок',
    'cta.details': 'Подробнее',
    'cta.viewAll': 'Смотреть все',
    'cta.viewProduct': 'Открыть продукт',
    'cta.allProducts': 'Вся продукция',

    'hero.eyebrow': 'Надёжные смазочные материалы с 2013 года',
    'hero.title': 'Надёжная смазка для вашей техники.',
    'hero.subtitle': 'Chilon Lubricants — ведущий завод смазочных материалов в Ташкенте. Более 350 видов продукции для автомобильной, промышленной и железнодорожной техники.',
    'hero.point1': 'Сертифицирована по международным стандартам',
    'hero.point2': 'Более 9 000 тонн годовой мощности',
    'hero.point3': 'Доставка во все регионы Узбекистана',
    'hero.featured.tag': 'Новое сезонное предложение',
    'hero.featured.name': 'CHILON Platinum 5W-30',
    'hero.featured.desc': 'Премиальное синтетическое моторное масло для легковых автомобилей.',

    'stat.production': 'тонн годовая мощность',
    'stat.products': 'видов продукции',
    'stat.years': 'лет опыта',
    'stat.regions': 'региональных дилеров',

    'sec.featured.title': 'Сезонное предложение',
    'sec.featured.sub': 'Премиальное синтетическое моторное масло нового поколения — для любой погоды.',

    'sec.cats.eyebrow': 'Категории продукции',
    'sec.cats.title': 'Точная формула для каждой техники',
    'sec.cats.sub': '11 категорий, более 350 вариантов. От легковых автомобилей до промышленного оборудования — закрываем весь спектр.',

    'sec.why.eyebrow': 'Почему Chilon',
    'sec.why.title': 'Качество — наш первый принцип',
    'sec.why.sub': 'Премиальные смазочные материалы, произведённые в Узбекистане, сертифицированы по международным стандартам.',
    'sec.why.1.t': 'Международное качество',
    'sec.why.1.d': 'Формулы соответствуют стандартам API, ACEA, ILSAC и JASO.',
    'sec.why.2.t': 'Местное производство',
    'sec.why.2.d': '100% производится в Узбекистане, на современном заводе в Бектемирском районе.',
    'sec.why.3.t': 'Быстрая доставка',
    'sec.why.3.d': 'В течение 24 часов через сеть дилеров в Ташкенте и регионах.',
    'sec.why.4.t': 'Техническая поддержка',
    'sec.why.4.d': 'Наши эксперты помогут подобрать продукт под вашу технику.',
    'sec.why.5.t': 'Оптовые цены',
    'sec.why.5.d': 'Специальные условия и постоянные скидки для B2B клиентов.',
    'sec.why.6.t': 'Сертификаты',
    'sec.why.6.d': 'Сертификаты ISO 9001 и ISO 14001 по качеству и экологии.',

    'sec.mfg.eyebrow': 'Наш завод',
    'sec.mfg.title': 'Высокотехнологичное производство в Ташкенте',
    'sec.mfg.sub': 'Завод запущен в 2013 году — флагман программы импортозамещения Узбекистана.',
    'sec.mfg.b1.t': 'Автоматизированная линия',
    'sec.mfg.b1.d': 'Европейское оборудование, 12-ступенчатый синтез.',
    'sec.mfg.b2.t': 'Лабораторный контроль',
    'sec.mfg.b2.d': 'Каждая партия проходит контроль на входе и выходе.',
    'sec.mfg.b3.t': 'Мощность 9 000+ тонн',
    'sec.mfg.b3.d': 'Годовой объём покрывает потребности рынка Узбекистана.',

    'sec.partners.eyebrow': 'Партнёры',
    'sec.partners.title': 'Нам доверяют лидеры отрасли',
    'sec.partners.sub': 'Узбекистон темир йўллари, GM Uzbekistan, КамАЗ и десятки других брендов.',

    'sec.testimonial.eyebrow': 'Отзывы клиентов',
    'sec.testimonial.title': 'Что говорят клиенты',
    'sec.testimonial.1.text': 'Chilon предлагает лучшее соотношение цены и качества на рынке. Используем только этот бренд уже несколько лет.',
    'sec.testimonial.1.author': 'Анвар Каримов',
    'sec.testimonial.1.role': 'Автомеханик, Ташкент',
    'sec.testimonial.2.text': 'С B2B-отделом работать удобно. Быстрая доставка и постоянная техническая поддержка.',
    'sec.testimonial.2.author': 'Дильшод Юсупов',
    'sec.testimonial.2.role': 'Менеджер по закупкам',
    'sec.testimonial.3.text': 'Идеальное решение для парка грузовиков. Высокое качество и долгий ресурс.',
    'sec.testimonial.3.author': 'Шерзод Рахимов',
    'sec.testimonial.3.role': 'Руководитель автопарка',

    'sec.faq.eyebrow': 'Частые вопросы',
    'sec.faq.title': 'Нужна помощь в подборе?',
    'sec.faq.1.q': 'Какое масло выбрать для моей машины?',
    'sec.faq.1.a': 'Подбирайте по рекомендациям производителя автомобиля, классу вязкости SAE и спецификации API. Наши эксперты подскажут бесплатно.',
    'sec.faq.2.q': 'Как часто нужно менять масло?',
    'sec.faq.2.a': 'Стандарт — каждые 10 000 км или раз в год. Для премиум-синтетики — до 15 000 км. Точный интервал указан в инструкции к автомобилю.',
    'sec.faq.3.q': 'Чем синтетика отличается от минерального масла?',
    'sec.faq.3.a': 'Синтетика получается в результате заводского синтеза и стабильно работает в широком диапазоне температур. Минеральные масла дешевле, но ресурс короче.',
    'sec.faq.4.q': 'Можно ли заказать оптом?',
    'sec.faq.4.a': 'Да. Наш B2B-отдел работает с предприятиями, СТО и дилерами на специальных условиях.',

    'sec.news.eyebrow': 'Новости',
    'sec.news.title': 'Новости компании',

    'sec.cta.title': 'Подберём точную формулу под ваш проект',
    'sec.cta.sub': 'Пришлите ваши технические требования — наши эксперты порекомендуют оптимальное решение в течение 24 часов.',

    'products.title': 'Каталог продукции',
    'products.sub': '{n} продуктов · все категории',
    'products.all': 'Все категории',
    'products.search': 'Поиск по названию или коду',
    'products.empty': 'Ничего не найдено',
    'products.empty.sub': 'Измените фильтры и попробуйте снова.',
    'products.reset': 'Сбросить фильтры',
    'products.found': 'найдено',
    'products.sort': 'Сортировка',
    'products.sort.default': 'По умолчанию',
    'products.sort.az': 'Название (А–Я)',
    'products.sort.za': 'Название (Я–А)',
    'products.view.grid': 'Сетка',
    'products.view.list': 'Список',
    'products.filters': 'Фильтры',
    'products.viscosity': 'Вязкость (SAE)',
    'products.type': 'Тип',
    'products.code': 'Код',
    'products.applications': 'Применение',
    'products.specs': 'Характеристики',
    'products.related': 'Похожие продукты',
    'products.back': 'Вернуться в каталог',
    'products.packaging': 'Фасовка',
    'products.packagingSizes': '1L · 4L · 5L · 20L · 200L',
    'products.advantages': 'Ключевые преимущества',
    'products.adv.1': 'Высокоиндексная синтетическая база',
    'products.adv.2': 'Стабильность в широком диапазоне температур',
    'products.adv.3': 'Увеличенный ресурс',
    'products.adv.4': 'Защита внутренних деталей двигателя',
    'products.share': 'Поделиться',

    'news.back': 'Назад к новостям',
    'news.read': 'Читать статью',
    'news.related': 'Другие материалы',

    'about.eyebrow': 'О компании',
    'about.title': 'Ведущий завод смазочных материалов в Узбекистане.',
    'about.sub': 'Построен на качестве и инновациях — обслуживаем регион с 2013 года.',
    'about.mission.eyebrow': 'Наша миссия',
    'about.mission.title': 'Обеспечивать промышленность Узбекистана качественной смазкой.',
    'about.mission.body': 'Мы поставляем премиальные смазочные материалы, произведённые локально как альтернатива импорту — каждый продукт сертифицирован по международным стандартам.',
    'about.history.eyebrow': 'История',
    'about.history.title': 'Наш путь',
    'about.values.eyebrow': 'Ценности',
    'about.values.title': 'Принципы, которые нас определяют',
    'about.certs.eyebrow': 'Сертификаты',
    'about.certs.title': 'Международное подтверждение качества',
    'about.certs.list': 'ISO 9001 · ISO 14001 · API · ACEA · JASO · GOST',

    'partners.title': 'Партнёрская сеть',
    'partners.sub': 'Работаем с надёжными брендами по всему миру. Более 50 официальных партнёров в производстве и дистрибуции.',
    'partners.become': 'Стать партнёром',
    'partners.becomeSub': 'Хотите войти в нашу дилерскую сеть? Свяжитесь с нами.',

    'contacts.title': 'Свяжитесь с нами',
    'contacts.sub': 'Отвечаем на любой запрос в течение 24 часов. Технические консультации и расчёт цен.',
    'contacts.departments': 'Отделы',
    'contacts.dealers': 'Региональные дилеры',
    'contacts.address': 'Адрес',
    'contacts.email': 'Электронная почта',
    'contacts.hours': 'Часы работы',
    'contacts.form.title': 'Форма обратной связи',
    'contacts.form.sub': 'Заполните форму и мы свяжемся с вами в ближайшее время.',
    'contacts.form.name': 'Ваше имя',
    'contacts.form.phone': 'Ваш телефон',
    'contacts.form.email': 'Электронная почта',
    'contacts.form.message': 'Ваш запрос',
    'contacts.form.send': 'Отправить',
    'contacts.form.ok': 'Спасибо! Запрос получен. Мы свяжемся с вами в ближайшее время.',

    'footer.tagline': 'Ведущий производитель смазочных материалов в Узбекистане.',
    'footer.nav': 'Навигация',
    'footer.catalog': 'Каталог',
    'footer.contacts': 'Контакты',
    'footer.rights': 'Все права защищены.',
    'footer.madeIn': 'Сделано в Узбекистане',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия использования',
  },
};

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  pick: (v: Localized | undefined) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && LANGS.includes(stored)) setLangState(stored);
    document.documentElement.lang = stored || DEFAULT_LANG;
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    }
  };

  const t = (key: string, vars?: Record<string, string | number>) => {
    let s = STRINGS[lang][key] || STRINGS[DEFAULT_LANG][key] || key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
    return s;
  };

  const pick = (v: Localized | undefined): string => {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    return v[lang] || v.uz || v.ru || v.en || Object.values(v)[0] || '';
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t, pick }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
