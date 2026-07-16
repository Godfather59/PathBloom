export const ARABIC_UI_KEY_SUPPLEMENTS = Object.freeze({
  'main.dailyLife': 'الحياة اليومية',
  'main.dailyLifeDesc': 'بذرة مشتركة واحدة وفرصة واحدة كل يوم.',
  'main.dailyStreak': 'السلسلة اليومية',
  'main.dailyStreakDays': 'سلسلة مستمرة منذ {count} يوم',
  'main.dailyAlreadyPlayed': 'أكملت الحياة اليومية لهذا اليوم بالفعل.',
});

export const ARABIC_TEXT_SUPPLEMENTS = Object.freeze({
  'Daily Life': 'الحياة اليومية',
  'One shared seed, one chance per day.': 'بذرة مشتركة واحدة وفرصة واحدة كل يوم.',
  Streak: 'السلسلة اليومية',
  '{count} day streak': 'سلسلة مستمرة منذ {count} يوم',
  'Daily life already completed today.': 'أكملت الحياة اليومية لهذا اليوم بالفعل.',
  'Dark Mode': 'الوضع الداكن',
  'Clear Mode': 'الوضع الفاتح',

  // High-value hardcoded screens reported by the static audit.
  'Career Skills': 'مهارات المهنة',
  'Your current career does not have a skill tree available.':
    'لا تتوفر شجرة مهارات لمهنتك الحالية.',
  'Available Points': 'النقاط المتاحة',
  'Total Earned': 'إجمالي المكتسب',
  'No Active Challenge': 'لا يوجد تحدٍ نشط',
  'Start a challenge from the main menu when creating a new life.':
    'ابدأ تحديا من القائمة الرئيسية عند إنشاء حياة جديدة.',
  'Challenge List': 'قائمة التحديات',
  'Country Not Found': 'لم يتم العثور على الدولة',
  'Country data is not available yet. Age up to generate the world.':
    'بيانات الدولة غير متاحة بعد. تقدم في العمر لإنشاء العالم.',
  'Capital:': 'العاصمة:',
  'Continent:': 'القارة:',
  'Government:': 'نظام الحكم:',
  'GDP:': 'الناتج المحلي:',
  'Population:': 'السكان:',
  'Influence:': 'النفوذ:',
  Leader: 'القائد',
  'National Stats': 'الإحصائيات الوطنية',
  Economy: 'الاقتصاد',
  'GDP Growth:': 'نمو الناتج المحلي:',
  'Unemployment:': 'البطالة:',
  'Inflation:': 'التضخم:',
  'Tax Rate:': 'معدل الضريبة:',
  'Poverty:': 'الفقر:',
  'Debt:': 'الدين:',
  'Simulation batch size:': 'حجم دفعة المحاكاة:',
  'Death causes:': 'أسباب الوفاة:',
  'Top jobs at death:': 'أكثر الوظائف عند الوفاة:',
  'Errors:': 'الأخطاء:',
  'Oops! Something went wrong': 'عذرا! حدث خطأ ما',
  'Error Details:': 'تفاصيل الخطأ:',
  'Try Again': 'حاول مجددا',
  'Reload Page': 'أعد تحميل الصفحة',
});

export function translateSupplementalArabicText(value) {
  return ARABIC_TEXT_SUPPLEMENTS[String(value ?? '').trim()] || value;
}
