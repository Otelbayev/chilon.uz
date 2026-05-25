'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'uz' | 'en' | 'ru';
export const LANGS: Lang[] = ['uz', 'en', 'ru'];
export const DEFAULT_LANG: Lang = 'uz';

const STORAGE_KEY = 'chilon_lang';

type Dict = Record<string, string>;

const STRINGS: Record<Lang, Dict> = {
  uz: {
    'nav.home': 'Bosh sahifa',
    'nav.about': 'Biz haqimizda',
    'nav.products': 'Mahsulotlar',
    'nav.partners': 'Hamkorlar',
    'nav.news': 'Yangiliklar',
    'nav.contacts': 'Aloqa',
    'nav.buy': 'Sotib olish',
    'nav.specialists': 'Mutaxassislar uchun',
    'hero.tag': 'Premium moylash mahsulotlari',
    'hero.title': 'CHILON — sifatli milliy mahsulot',
    'hero.subtitle': 'Moylash materiallarini ishlab chiqarish va sotish',
    'search.placeholder': 'Mahsulot, kategoriya yoki yangilik qidirish...',
    'search.empty': 'Hech narsa topilmadi',
    'categories.title': 'Mahsulot katalogi',
    'categories.subtitle': 'Kategoriyalardan birini tanlang',
    'categories.view': 'Kategoriyani ko\'rish',
    'hero.cta.products': 'Mahsulotlarni ko\'rish',
    'hero.cta.contact': 'Bog\'lanish',
    'home.stat.products': 'Mahsulot',
    'home.stat.categories': 'Kategoriya',
    'home.stat.years': 'Tajriba yili',
    'products.title': 'Mahsulotlar katalogi',
    'products.subtitle': 'Avtomobillar va sanoat texnikasi uchun keng tanlov',
    'products.all': 'Barchasi',
    'products.search': 'Mahsulotni izlash...',
    'products.found': 'topildi',
    'products.empty': 'Mahsulot topilmadi',
    'products.detail.specs': 'Texnik xususiyatlari',
    'products.detail.applications': 'Qo\'llanilishi',
    'products.detail.related': 'Boshqa mahsulotlar',
    'products.filter': 'Filtrlar',
    'products.filterCategories': 'Kategoriyalar',
    'products.sort': 'Saralash',
    'products.sort.default': 'Standart',
    'products.sort.az': 'Nom: A–Z',
    'products.sort.za': 'Nom: Z–A',
    'products.view.grid': 'Karta',
    'products.view.list': 'Ro\'yxat',
    'products.reset': 'Tozalash',
    'products.loadMore': 'Yana ko\'rsatish',
    'products.showing': 'Ko\'rsatildi',
    'products.of': 'dan',
    'product.code': 'Kod',
    'common.apply': 'Qo\'llash',
    'common.close': 'Yopish',
    'news.title': 'Yangiliklar',
    'news.subtitle': 'Kompaniyamiz va sanoat yangiliklari',
    'news.readMore': 'Batafsil',
    'news.back': 'Yangiliklar ro\'yxatiga qaytish',
    'partners.title': 'Bizning hamkorlar',
    'partners.subtitle': 'Dunyo bo\'ylab ishonchli brendlar',
    'about.title': 'Biz haqimizda',
    'about.subtitle': 'Sifat va ishonchga asoslangan kompaniya',
    'contacts.title': 'Biz bilan bog\'laning',
    'contacts.subtitle': 'Savollaringiz bo\'lsa, biz har doim tayyormiz',
    'contacts.form.name': 'Ismingiz',
    'contacts.form.phone': 'Telefon raqam',
    'contacts.form.message': 'Xabar',
    'contacts.form.submit': 'Yuborish',
    'contacts.form.success': 'Rahmat! Tez orada siz bilan bog\'lanamiz.',
    'contacts.form.error': 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.',
    'contacts.departments': 'Bo\'limlar',
    'contacts.dealers': 'Mintaqaviy dilerlar',
    'footer.rights': 'Barcha huquqlar himoyalangan',
    'common.loading': 'Yuklanmoqda...',
    'common.back': 'Orqaga',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.products': 'Products',
    'nav.partners': 'Partners',
    'nav.news': 'News',
    'nav.contacts': 'Contacts',
    'nav.buy': 'Buy',
    'nav.specialists': 'For specialists',
    'hero.tag': 'Premium lubricants',
    'hero.title': 'CHILON — a quality national product',
    'hero.subtitle': 'Production and sale of lubricants',
    'search.placeholder': 'Search products, categories or news...',
    'search.empty': 'Nothing found',
    'categories.title': 'Product catalog',
    'categories.subtitle': 'Pick a category to explore',
    'categories.view': 'View category',
    'hero.cta.products': 'Browse products',
    'hero.cta.contact': 'Contact us',
    'home.stat.products': 'Products',
    'home.stat.categories': 'Categories',
    'home.stat.years': 'Years experience',
    'products.title': 'Product catalog',
    'products.subtitle': 'Wide selection for automotive and industrial machinery',
    'products.all': 'All',
    'products.search': 'Search products...',
    'products.found': 'found',
    'products.empty': 'No products found',
    'products.detail.specs': 'Specifications',
    'products.detail.applications': 'Applications',
    'products.detail.related': 'Related products',
    'products.filter': 'Filters',
    'products.filterCategories': 'Categories',
    'products.sort': 'Sort',
    'products.sort.default': 'Default',
    'products.sort.az': 'Name: A–Z',
    'products.sort.za': 'Name: Z–A',
    'products.view.grid': 'Grid',
    'products.view.list': 'List',
    'products.reset': 'Reset',
    'products.loadMore': 'Load more',
    'products.showing': 'Showing',
    'products.of': 'of',
    'product.code': 'Code',
    'common.apply': 'Apply',
    'common.close': 'Close',
    'news.title': 'News',
    'news.subtitle': 'Company and industry updates',
    'news.readMore': 'Read more',
    'news.back': 'Back to news',
    'partners.title': 'Our partners',
    'partners.subtitle': 'Trusted brands worldwide',
    'about.title': 'About us',
    'about.subtitle': 'A company built on quality and trust',
    'contacts.title': 'Get in touch',
    'contacts.subtitle': 'We\'re here to help with any question',
    'contacts.form.name': 'Your name',
    'contacts.form.phone': 'Phone number',
    'contacts.form.message': 'Message',
    'contacts.form.submit': 'Send',
    'contacts.form.success': 'Thank you! We\'ll get back to you shortly.',
    'contacts.form.error': 'Something went wrong. Please try again.',
    'contacts.departments': 'Departments',
    'contacts.dealers': 'Regional dealers',
    'footer.rights': 'All rights reserved',
    'common.loading': 'Loading...',
    'common.back': 'Back',
  },
  ru: {
    'nav.home': 'Главная',
    'nav.about': 'О компании',
    'nav.products': 'Продукция',
    'nav.partners': 'Партнёры',
    'nav.news': 'Новости',
    'nav.contacts': 'Контакты',
    'nav.buy': 'Купить',
    'nav.specialists': 'Купить специалистам',
    'hero.tag': 'Премиальные смазочные материалы',
    'hero.title': 'CHILON — это качественный национальный продукт',
    'hero.subtitle': 'Производство и реализация смазочных материалов',
    'search.placeholder': 'Поиск продукции, категории или новости...',
    'search.empty': 'Ничего не найдено',
    'categories.title': 'Каталог продукции',
    'categories.subtitle': 'Выберите интересующую категорию',
    'categories.view': 'Смотреть категорию',
    'hero.cta.products': 'Смотреть продукцию',
    'hero.cta.contact': 'Связаться',
    'home.stat.products': 'Продуктов',
    'home.stat.categories': 'Категорий',
    'home.stat.years': 'Лет опыта',
    'products.title': 'Каталог продукции',
    'products.subtitle': 'Широкий выбор для автомобилей и промышленной техники',
    'products.all': 'Все',
    'products.search': 'Поиск продукции...',
    'products.found': 'найдено',
    'products.empty': 'Продукция не найдена',
    'products.detail.specs': 'Технические характеристики',
    'products.detail.applications': 'Применение',
    'products.detail.related': 'Похожие продукты',
    'products.filter': 'Фильтры',
    'products.filterCategories': 'Категории',
    'products.sort': 'Сортировка',
    'products.sort.default': 'По умолчанию',
    'products.sort.az': 'Название: А–Я',
    'products.sort.za': 'Название: Я–А',
    'products.view.grid': 'Сетка',
    'products.view.list': 'Список',
    'products.reset': 'Сбросить',
    'products.loadMore': 'Показать ещё',
    'products.showing': 'Показано',
    'products.of': 'из',
    'product.code': 'Код',
    'common.apply': 'Применить',
    'common.close': 'Закрыть',
    'news.title': 'Новости',
    'news.subtitle': 'Новости компании и отрасли',
    'news.readMore': 'Подробнее',
    'news.back': 'Назад к новостям',
    'partners.title': 'Наши партнёры',
    'partners.subtitle': 'Надёжные бренды со всего мира',
    'about.title': 'О компании',
    'about.subtitle': 'Компания, построенная на качестве и доверии',
    'contacts.title': 'Свяжитесь с нами',
    'contacts.subtitle': 'Мы всегда готовы ответить на ваши вопросы',
    'contacts.form.name': 'Ваше имя',
    'contacts.form.phone': 'Телефон',
    'contacts.form.message': 'Сообщение',
    'contacts.form.submit': 'Отправить',
    'contacts.form.success': 'Спасибо! Мы скоро с вами свяжемся.',
    'contacts.form.error': 'Произошла ошибка. Попробуйте ещё раз.',
    'contacts.departments': 'Отделы',
    'contacts.dealers': 'Региональные дилеры',
    'footer.rights': 'Все права защищены',
    'common.loading': 'Загрузка...',
    'common.back': 'Назад',
  },
};

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored && LANGS.includes(stored as Lang)) {
      setLangState(stored as Lang);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    }
  };

  const t = (key: string): string => STRINGS[lang][key] || STRINGS[DEFAULT_LANG][key] || key;

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
