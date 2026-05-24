'use client';

import LegalPage from '@/components/LegalPage';

export default function TermsPage() {
  return (
    <LegalPage
      title="Foydalanish shartlari"
      intro="Chilon Lubricants saytidan foydalanish shartlari va qoidalari."
      sections={[
        {
          title: 'Umumiy qoidalar',
          body:
            'Saytdan foydalanish orqali siz ushbu shartlarni qabul qilgan hisoblanasiz. Shartlar bilan rozi bo‘lmasangiz, iltimos, saytdan foydalanmang.',
        },
        {
          title: 'Mahsulotlar va xizmatlar',
          body:
            'Saytda ko‘rsatilgan mahsulot tavsiflari va texnik xususiyatlar ishlab chiqaruvchi tomonidan e’lon qilingan ma’lumotlarga asoslanadi. Narxlar va mavjudlik oldindan ogohlantirilmagan holda o‘zgartirilishi mumkin. Yakuniy narx va shartlar buyurtma berishda tasdiqlanadi.',
        },
        {
          title: 'Intellektual mulk',
          body:
            'Saytdagi barcha materiallar — matn, tasvirlar, logotip va brend nomlari Chilon Lubricants kompaniyasiga tegishli. Ruxsatsiz nusxalash, tarqatish yoki ulardan foydalanish taqiqlanadi.',
        },
        {
          title: 'Javobgarlikni cheklash',
          body:
            'Sayt ma’lumotlari ma’lumotnoma maqsadida taqdim etiladi. Mahsulotlarni texnikangiz uchun to‘g‘ri tanlash bo‘yicha aniq tavsiyalar uchun mutaxassislarimizga murojaat qiling.',
        },
        {
          title: 'O‘zgartirishlar',
          body:
            'Kompaniyamiz mazkur shartlarni istalgan vaqtda o‘zgartirish huquqini o‘zida saqlab qoladi. O‘zgartirishlar saytda e’lon qilingan paytdan boshlab kuchga kiradi.',
        },
      ]}
    />
  );
}
