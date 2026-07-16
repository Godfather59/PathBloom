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
  'Dogecoin surged!': 'ارتفع سعر دوجكوين بقوة!',
  'Dogecoin crashed!': 'انهار سعر دوجكوين!',
  'Bitcoin surged!': 'ارتفع سعر بيتكوين بقوة!',
  'Bitcoin crashed!': 'انهار سعر بيتكوين!',
  Unemployed: 'عاطل عن العمل',
  Dad: 'والدك',
  Mom: 'والدتك',

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

const ARABIC_ENTITY_SUPPLEMENTS = Object.freeze({
  Dad: 'والدك',
  Mom: 'والدتك',
  Father: 'الأب',
  Mother: 'الأم',
  Parent: 'أحد والديك',
  Brother: 'أخوك',
  Sister: 'أختك',
  Son: 'ابنك',
  Daughter: 'ابنتك',
  Child: 'طفلك',
  Husband: 'زوجك',
  Wife: 'زوجتك',
  Partner: 'شريكك',
  Friend: 'صديقك',
  Morocco: 'المغرب',
  Germany: 'ألمانيا',
  France: 'فرنسا',
  Spain: 'إسبانيا',
  Italy: 'إيطاليا',
  Canada: 'كندا',
  Australia: 'أستراليا',
  Japan: 'اليابان',
  China: 'الصين',
  India: 'الهند',
  Russia: 'روسيا',
  Brazil: 'البرازيل',
  Mexico: 'المكسيك',
  'United States': 'الولايات المتحدة',
  'United Kingdom': 'المملكة المتحدة',
  'South Korea': 'كوريا الجنوبية',
  'Saudi Arabia': 'السعودية',
  UAE: 'الإمارات',
  Dogecoin: 'دوجكوين',
  Bitcoin: 'بيتكوين',
  Ethereum: 'إيثيريوم',
  'Index Fund': 'صندوق المؤشر',
  'Stock Market': 'سوق الأسهم',
});

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function translateSupplementalArabicEntity(value) {
  const source = String(value ?? '').trim();
  return ARABIC_ENTITY_SUPPLEMENTS[source] || source;
}

export function replaceKnownEnglishEntitiesInArabic(value) {
  let result = String(value ?? '');
  const entries = Object.entries(ARABIC_ENTITY_SUPPLEMENTS)
    .sort(([left], [right]) => right.length - left.length);

  entries.forEach(([english, arabic]) => {
    const pattern = new RegExp(`(^|[^A-Za-z])${escapeRegExp(english)}(?=$|[^A-Za-z])`, 'g');
    result = result.replace(pattern, (_match, prefix) => `${prefix}${arabic}`);
  });

  return result;
}

const ARABIC_RUNTIME_PATTERNS = Object.freeze([
  [/^(.+) moved to (.+) to start a new chapter\.$/, match =>
    `انتقل ${translateSupplementalArabicEntity(match[1])} إلى ${translateSupplementalArabicEntity(match[2])} لبدء فصل جديد.`],
  [/^(.+) surged!$/, match =>
    `ارتفع سعر ${translateSupplementalArabicEntity(match[1])} بقوة!`],
  [/^(.+) crashed!$/, match =>
    `انهار سعر ${translateSupplementalArabicEntity(match[1])}!`],
  [/^(.+) rose sharply!$/, match =>
    `ارتفع سعر ${translateSupplementalArabicEntity(match[1])} بشكل حاد!`],
  [/^(.+) fell sharply!$/, match =>
    `انخفض سعر ${translateSupplementalArabicEntity(match[1])} بشكل حاد!`],
  [/^(.+) got married\.$/, match =>
    `تزوج ${translateSupplementalArabicEntity(match[1])}.`],
  [/^(.+) had a baby\.$/, match =>
    `رُزق ${translateSupplementalArabicEntity(match[1])} بمولود.`],
  [/^(.+) started a new job as (.+)\.$/, match =>
    `بدأ ${translateSupplementalArabicEntity(match[1])} عملا جديدا بوصفه ${translateSupplementalArabicEntity(match[2])}.`],
  [/^(.+) was promoted to (.+)\.$/, match =>
    `تمت ترقية ${translateSupplementalArabicEntity(match[1])} إلى ${translateSupplementalArabicEntity(match[2])}.`],
  [/^(.+) died at age (\d+)\.$/, match =>
    `توفي ${translateSupplementalArabicEntity(match[1])} عن عمر ${match[2]} سنة.`],
  [/^The stock market surged!$/, () => 'ارتفعت سوق الأسهم بقوة!'],
  [/^The stock market crashed!$/, () => 'انهارت سوق الأسهم!'],
]);

export function translateSupplementalArabicText(value) {
  const source = String(value ?? '').trim();
  if (!source) return value;

  const exact = ARABIC_TEXT_SUPPLEMENTS[source];
  if (exact) return exact;

  for (const [pattern, translate] of ARABIC_RUNTIME_PATTERNS) {
    const match = source.match(pattern);
    if (match) return translate(match);
  }

  const entityReplaced = replaceKnownEnglishEntitiesInArabic(source);
  return entityReplaced !== source ? entityReplaced : value;
}
