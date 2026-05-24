'use client';

import LegalPage from '@/components/LegalPage';

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Maxfiylik siyosati"
      intro="Chilon Lubricants saytidan foydalanish davomida shaxsiy ma’lumotlarni qanday qayta ishlashimiz haqida ma’lumot."
      sections={[
        {
          title: 'Yig‘iladigan ma’lumotlar',
          body:
            'Bog‘lanish formasini to‘ldirishingiz natijasida biz quyidagi ma’lumotlarni olamiz: ism, telefon raqam, elektron pochta va siz yuborgan xabar matni. Saytda foydalanishda Til tanlovingiz brauzeringizning localStorage’ida saqlanadi.',
        },
        {
          title: 'Foydalanish maqsadi',
          body:
            'Yig‘ilgan ma’lumotlardan faqat sizning so‘rovingizga javob berish, texnik maslahat berish va xizmat ko‘rsatish uchun foydalanamiz. Reklama yoki uchinchi shaxslarga sotish maqsadlarida foydalanmaymiz.',
        },
        {
          title: 'Ma’lumotlarni saqlash',
          body:
            'Sizning ma’lumotlaringiz Chilon Lubricants kompaniyasining xavfsiz tizimida saqlanadi. So‘rov yopilganidan keyin ma’lumotlar 12 oy davomida arxivda saqlanadi.',
        },
        {
          title: 'Cookie va analitika',
          body:
            'Sayt funksionalligi uchun zarur bo‘lgan cookie-fayllardan foydalanamiz. Trafikni tahlil qilish uchun anonim analitika to‘planishi mumkin.',
        },
        {
          title: 'Foydalanuvchi huquqlari',
          body:
            'Siz o‘z ma’lumotlaringizni ko‘rish, o‘zgartirish yoki o‘chirishni so‘rashingiz mumkin. Buning uchun info@chilon.uz manziliga murojaat qiling.',
        },
      ]}
    />
  );
}
