const ARABIC_RE = /[\u0600-\u06ff]/;
const LATIN_RE = /[A-Za-z]/;
const PLACEHOLDER_AR_RE = /(?:^|\s)AR\s*$/i;
const LEAK_STORAGE_KEY = 'pathbloom.arabicLocalizationLeaks.v1';
const DIGIT_STYLE_KEY = 'pathbloom.arabicDigits.v1';
const MAX_LEAKS = 250;

const EXACT_AR = Object.freeze({
  // General UI
  Close: 'إغلاق',
  Cancel: 'إلغاء',
  Confirm: 'تأكيد',
  Continue: 'متابعة',
  Back: 'رجوع',
  Next: 'التالي',
  Done: 'تم',
  Save: 'حفظ',
  Delete: 'حذف',
  Edit: 'تعديل',
  Search: 'بحث',
  Settings: 'الإعدادات',
  Language: 'اللغة',
  Theme: 'المظهر',
  Sound: 'الصوت',
  On: 'تشغيل',
  Off: 'إيقاف',
  Loading: 'جارٍ التحميل',
  Paused: 'متوقف مؤقتا',
  'Resume Game': 'متابعة اللعبة',
  'Save Game': 'حفظ اللعبة',
  'God Mode': 'وضع التحكم الكامل',
  'Lifetime Stats': 'إحصائيات الحياة',
  'Current Life Trends': 'اتجاهات الحياة الحالية',
  'Simulation Overview': 'نظرة عامة على المحاكاة',
  'World Simulation 2.0': 'محاكاة العالم 2.0',
  'Content Studio': 'استوديو المحتوى',
  'Family Dynasty': 'سلالة العائلة',
  'World News': 'أخبار العالم',
  'World Overview': 'نظرة عامة على العالم',
  Relationships: 'العلاقات',
  'Life Timeline': 'الخط الزمني للحياة',
  'Event History': 'سجل الأحداث',
  'Country Profile': 'ملف الدولة',
  Achievements: 'الإنجازات',
  Challenges: 'التحديات',
  Tutorial: 'الشرح',
  'Debug Tools': 'أدوات التشخيص',
  'Reset Tutorial': 'إعادة الشرح',
  'Exit to Main Menu': 'الخروج إلى القائمة الرئيسية',
  'Are you sure you want to exit? Unsaved progress will be lost.':
    'هل أنت متأكد من الخروج؟ ستفقد التقدم غير المحفوظ.',
  Occupation: 'المهنة',
  Activities: 'الأنشطة',
  Assets: 'الممتلكات',
  Education: 'التعليم',
  Pets: 'الحيوانات الأليفة',
  Travel: 'السفر',
  Event: 'حدث',
  Age: 'العمر',
  Money: 'المال',
  Debt: 'الدين',
  Health: 'الصحة',
  Happiness: 'السعادة',
  Smarts: 'الذكاء',
  Looks: 'المظهر',
  Stress: 'التوتر',
  Karma: 'الكارما',
  Fame: 'الشهرة',
  Notoriety: 'السمعة السيئة',
  Energy: 'الطاقة',
  Student: 'طالب',
  Unemployed: 'عاطل عن العمل',
  Free: 'مجاني',
  Cost: 'التكلفة',
  Risk: 'المخاطرة',
  Low: 'منخفض',
  Medium: 'متوسط',
  High: 'مرتفع',
  Extreme: 'شديد جدا',
  None: 'لا يوجد',
  Required: 'إلزامي',
  Completed: 'مكتمل',
  Deferred: 'مؤجل',
  Public: 'عمومي',
  Private: 'خاص',

  // Time controls
  'Age Up': 'كبر سنة',
  '1 Month': 'شهر واحد',
  'Smart +5': 'تقدم ذكي 5 سنوات',
  'Smart +12 Months': 'تقدم ذكي 12 شهرا',
  'Stops when an important decision needs you.': 'يتوقف عندما يظهر قرار مهم يحتاج إليك.',
  'Monthly progression available:': 'التقدم الشهري متاح:',

  // Common decisions
  Ignore: 'تجاهل',
  'Ignore it': 'تجاهل الأمر',
  Refuse: 'ارفض',
  Accept: 'اقبل',
  Go: 'اذهب',
  Stay: 'ابق',
  'Stay home': 'ابق في المنزل',
  Leave: 'غادر',
  'Walk away': 'ابتعد',
  Participate: 'شارك',
  Report: 'بلّغ',
  Apologize: 'اعتذر',
  Help: 'ساعد',
  'Help them': 'ساعدهم',
  'Offer advice instead': 'قدم النصيحة بدلا من المال',
  'Keep it professional': 'حافظ على المهنية',
  'Try it': 'جرب',
  'Do it': 'افعلها',
  'Skip it': 'تجاوز الأمر',
  'Study instead': 'ادرس بدلا من ذلك',
  'Take the test': 'اجتز الاختبار',
  'Call Police': 'اتصل بالشرطة',
  'Return it': 'أعده إلى صاحبه',
  'Keep the cash': 'احتفظ بالمال',
  'Lend money': 'أقرض المال',
  Laugh: 'اضحك',
  Cry: 'ابكِ',
  Rage: 'اغضب',
  'Flirt back': 'بادل الغزل',

  // Common life events that previously leaked through placeholder translations
  'Your parents are fighting loudly.': 'والداك يتشاجران بصوت عالٍ.',
  'The stock market went up this year.': 'ارتفعت سوق الأسهم هذا العام.',
  'The stock market went down this year.': 'انخفضت سوق الأسهم هذا العام.',
  'Your partner has been texting a "friend" a lot lately. You feel jealous.':
    'يراسل شريكك «صديقا» كثيرا مؤخرا وتشعر بالغيرة.',
  'Confront them': 'واجه شريكك',
  'They were just planning your surprise party. Oops.':
    'كانوا يخططون لحفلة مفاجئة لك فقط. يا للإحراج.',
  'It eats at you all year.': 'ظل الشك يؤلمك طوال العام.',
  'You decided to run a marathon. You trained for months.':
    'قررت خوض سباق ماراثون وتدربت لأشهر.',
  'You are having a midlife crisis. You bought a red convertible.':
    'تمر بأزمة منتصف العمر واشتريت سيارة حمراء مكشوفة.',
  'A friend wants you to invest in their startup. It is a phone case that doubles as a wallet.':
    'يريد صديقك أن تستثمر في شركته الناشئة لصنع غطاء هاتف يعمل كمحفظة.',
  'Invest $500': 'استثمر 500 دولار',
  Pass: 'ارفض',
  'It actually took off! You made $2000 back.': 'نجح المشروع! استعدت 2,000 دولار.',
  'You missed the next big thing.': 'فوّت الفرصة الكبيرة القادمة.',
  "Your therapist says you have made great progress. But your insurance won't cover the next session.":
    'يقول معالجك إنك أحرزت تقدما كبيرا، لكن التأمين لن يغطي الجلسة القادمة.',
  'Pay out of pocket': 'ادفع من مالك',
  'Quit therapy': 'أوقف العلاج',
  'Your mental health is worth it.': 'صحتك النفسية تستحق ذلك.',
  'You will be fine. Probably.': 'ستكون بخير... على الأرجح.',
  'Your school is having a bake sale. Do you want to help?':
    'تنظم مدرستك سوقا للمخبوزات. هل تريد المساعدة؟',
  'Bake cookies': 'اخبز البسكويت',
  'Buy cookies': 'اشترِ البسكويت',
  'You sold out in an hour!': 'بعت كل الكمية خلال ساعة!',
  'You ate six cupcakes. Worth it.': 'أكلت ست قطع كعك، وكان الأمر يستحق.',
  'You wet the bed at a sleepover. So embarrassing.':
    'بللت الفراش خلال ليلة عند صديق. يا له من إحراج.',
  'You broke a vase playing ball inside. You are grounded for a week.':
    'كسرت مزهرية وأنت تلعب بالكرة في المنزل، فعوقبت أسبوعا.',
  'You got a pen pal from Japan! You write letters every month.':
    'أصبح لديك صديق مراسلة من اليابان وتتبادلان الرسائل كل شهر.',
  'You won a goldfish at the fair! You named it George.':
    'ربحت سمكة ذهبية في المهرجان وسميتها جورج.',
  'You started piano lessons. Your fingers hurt but it sounds nice.':
    'بدأت دروس البيانو. تؤلمك أصابعك لكن العزف جميل.',
  'Your family went to an amusement park! You rode the biggest rollercoaster.':
    'ذهبت عائلتك إلى مدينة الملاهي وركبت أكبر أفعوانية.',
  'Your parents signed you up for soccer! You hate it.':
    'سجّلك والداك في كرة القدم رغم أنك لا تحبها.',
  'Your child had a baby! You are a grandparent now!':
    'رُزق طفلك بمولود وأصبحت جدا الآن!',
  'You had a health scare. The doctors say you need to take it easy.':
    'مررت بوعكة مقلقة ونصحك الأطباء بالراحة.',
  'You find an old photo album and spend the afternoon reminiscing.':
    'وجدت ألبوم صور قديما وقضيت الظهيرة تستعيد الذكريات.',
  'Your lawyer recommends updating your will.': 'ينصحك محاميك بتحديث وصيتك.',
  'Update it': 'حدّث الوصية',
  Procrastinate: 'أجّل الأمر',
  'Peace of mind. Your affairs are in order.': 'اطمأننت بعد أن رتبت شؤونك.',
  'You will do it next year. Probably.': 'ستفعلها العام القادم... على الأرجح.',
  'You feel a sense of clarity. Life is good. You write down your thoughts.':
    'تشعر بصفاء داخلي وتدوّن أفكارك عن الحياة.',
  'A fan approaches you in a restaurant and asks for a selfie.':
    'اقترب منك معجب في مطعم وطلب صورة معك.',
  'Take the selfie': 'التقط الصورة',
  'Politely decline': 'ارفض بأدب',
  'You made their day!': 'أسعدته كثيرا!',
  'They understood. Mostly.': 'تفهم الأمر... إلى حد ما.',
  'A gossip site published a story about you. It is completely false.':
    'نشر موقع شائعات قصة كاذبة تماما عنك.',
  'Sue them': 'ارفع دعوى ضدهم',
  'The controversy made you more famous.': 'جعلتك الضجة أكثر شهرة.',
  'You won the lawsuit! Headlines everywhere.': 'ربحت الدعوى وتصدرت الأخبار!',
  'Not your finest moment.': 'لم تكن أفضل لحظاتك.',
  'You are due for your annual physical. You have been avoiding it.':
    'حان موعد فحصك الطبي السنوي وقد كنت تؤجله.',
  'Go to the doctor': 'اذهب إلى الطبيب',
  'Skip it again': 'أجّل الفحص مجددا',
  'Clean bill of health. What a relief!': 'صحتك جيدة. يا لها من راحة!',
  'Ignorance is bliss.': 'قد يبدو تجاهل الأمر مريحا مؤقتا.',
  'You threw your back out by sneezing. Getting old is humbling.':
    'أصبت بألم في ظهرك بسبب العطس. التقدم في العمر متعب.',
  'Your last child moved out. The house feels so quiet now.':
    'غادر آخر أبنائك المنزل وأصبح البيت هادئا جدا.',
  'Your extended family is organizing a reunion. You have not seen some of them in years.':
    'تنظم عائلتك الكبيرة لقاء ولم تر بعض أفرادها منذ سنوات.',
  'Make an excuse': 'اختلق عذرا',
  'You have been squinting at menus. It is time for reading glasses.':
    'أصبحت تجد صعوبة في قراءة القوائم وحان وقت نظارات القراءة.',
  'Your doctor says your cholesterol is high and your blood pressure is concerning.':
    'يقول طبيبك إن الكوليسترول وضغط الدم مرتفعان بشكل مقلق.',
  'Change diet and exercise': 'غيّر نظامك الغذائي ومارس الرياضة',
  'A year later, your numbers are perfect. Feel amazing!':
    'بعد عام أصبحت نتائجك ممتازة وتشعر بتحسن كبير!',
  'Ignorance is bliss until it is not.': 'التجاهل مريح إلى أن تتفاقم المشكلة.',
  'Your high school reunion is coming up. Do you go?':
    'اقترب لقاء خريجي مدرستك الثانوية. هل ستذهب؟',
  'Go and show off': 'اذهب وأظهر نجاحك',
  'Skip it': 'لا تذهب',
  'The water heater broke and the basement is flooding.':
    'تعطل سخان المياه وبدأ القبو يمتلئ بالماء.',

  // Deep simulation and geopolitical UI
  'Simulation Overview': 'نظرة عامة على المحاكاة',
  'Country rules': 'قواعد الدولة',
  'Personal finance': 'الوضع المالي',
  'Reputation & identity': 'السمعة والهوية',
  'Ongoing story chains': 'القصص المستمرة',
  'NPC memory': 'ذاكرة الشخصيات',
  'Monthly situation': 'الوضع الشهري',
  'Credit score': 'النقاط الائتمانية',
  'Total debt': 'إجمالي الدين',
  Savings: 'المدخرات',
  'Cost-of-living factor': 'معامل تكلفة المعيشة',
  'Income-tax rate': 'معدل ضريبة الدخل',
  'Retirement age': 'سن التقاعد',
  'National service': 'الخدمة الوطنية',
  'Job-market strength': 'قوة سوق العمل',
  Unemployment: 'البطالة',
  Healthcare: 'الرعاية الصحية',
  'World date': 'تاريخ العالم',
  'Global growth': 'النمو العالمي',
  'Global inflation': 'التضخم العالمي',
  'Global tension': 'التوتر العالمي',
  'Global trade': 'التجارة العالمية',
  Refugees: 'اللاجئون',
  Alliances: 'التحالفات',
  Sanctions: 'العقوبات',
  'Active wars': 'الحروب النشطة',
  'Largest economies': 'أكبر الاقتصادات',
  'Political influence': 'النفوذ السياسي',
  'Recent world history': 'أحدث أحداث العالم',
  'Open diplomatic talks': 'افتح محادثات دبلوماسية',
  'Impose sanctions': 'افرض عقوبات',
  'Fund humanitarian assistance': 'موّل المساعدة الإنسانية',
  'Approve emergency cost-of-living budget': 'وافق على ميزانية طارئة لمواجهة غلاء المعيشة',
});

const ENTITY_AR = Object.freeze({
  // Countries
  Morocco: 'المغرب',
  'United States': 'الولايات المتحدة',
  'United Kingdom': 'المملكة المتحدة',
  Canada: 'كندا',
  France: 'فرنسا',
  Germany: 'ألمانيا',
  Spain: 'إسبانيا',
  Italy: 'إيطاليا',
  Portugal: 'البرتغال',
  Russia: 'روسيا',
  China: 'الصين',
  Japan: 'اليابان',
  India: 'الهند',
  Brazil: 'البرازيل',
  Mexico: 'المكسيك',
  Australia: 'أستراليا',
  'South Korea': 'كوريا الجنوبية',
  'Saudi Arabia': 'السعودية',
  UAE: 'الإمارات',
  Turkey: 'تركيا',
  Algeria: 'الجزائر',
  Tunisia: 'تونس',
  Egypt: 'مصر',

  // Governments and politics
  Democracy: 'ديمقراطية',
  Republic: 'جمهورية',
  Monarchy: 'ملكية',
  'Constitutional Monarchy': 'ملكية دستورية',
  Autocracy: 'حكم استبدادي',
  Dictatorship: 'ديكتاتورية',
  'Military Junta': 'مجلس عسكري',
  'Transitional Government': 'حكومة انتقالية',
  President: 'رئيس الدولة',
  'Prime Minister': 'رئيس الحكومة',
  King: 'ملك',
  Queen: 'ملكة',
  Mayor: 'عمدة',
  Governor: 'حاكم',
  Senator: 'عضو مجلس الشيوخ',
  Minister: 'وزير',
  Election: 'انتخابات',
  Coup: 'انقلاب',
  Revolution: 'ثورة',
  War: 'حرب',
  Peace: 'سلام',
  Alliance: 'تحالف',
  Rivalry: 'خصومة',

  // Relationships and statuses
  Father: 'الأب',
  Mother: 'الأم',
  Parent: 'أحد الوالدين',
  Sibling: 'أخ أو أخت',
  Brother: 'أخ',
  Sister: 'أخت',
  Child: 'طفل',
  Son: 'ابن',
  Daughter: 'ابنة',
  Grandchild: 'حفيد',
  Partner: 'شريك',
  Spouse: 'زوج',
  Fiance: 'خطيب',
  'Best Friend': 'أفضل صديق',
  Friend: 'صديق',
  Coworker: 'زميل عمل',
  Deceased: 'متوفى',
  Married: 'متزوج',
  Single: 'أعزب',
  Divorced: 'مطلق',
  Estranged: 'منقطع العلاقة',

  // Education and careers
  'Elementary School': 'المدرسة الابتدائية',
  'Middle School': 'المدرسة الإعدادية',
  'High School': 'المدرسة الثانوية',
  University: 'الجامعة',
  College: 'الجامعة',
  'Graduate School': 'الدراسات العليا',
  Teacher: 'مدرس',
  Doctor: 'طبيب',
  Nurse: 'ممرض',
  Lawyer: 'محام',
  Engineer: 'مهندس',
  Programmer: 'مبرمج',
  Manager: 'مدير',
  Executive: 'مسؤول تنفيذي',
  Soldier: 'جندي',
  Officer: 'ضابط',
  Police: 'الشرطة',
  Athlete: 'رياضي',
  Musician: 'موسيقي',
  Actor: 'ممثل',
  'Temporary Worker': 'عامل مؤقت',
  'National Service Recruit': 'مجند في الخدمة الوطنية',

  // Leader traits
  Pragmatic: 'عملي',
  Aggressive: 'عدواني',
  Diplomatic: 'دبلوماسي',
  Populist: 'شعبوي',
  Reformist: 'إصلاحي',
  Authoritarian: 'سلطوي',
  Corrupt: 'فاسد',
  Idealistic: 'مثالي',
});

const PATTERN_AR = Object.freeze([
  [/^(\d+) years old$/, match => `${formatArabicDuration(Number(match[1]), 'year')}`],
  [/^(\d+) months?$/, match => formatArabicDuration(Number(match[1]), 'month')],
  [/^Age (\d+)$/, match => `العمر ${formatArabicNumber(Number(match[1]))}`],
  [/^\$([\d,.-]+)$/, match => formatArabicMoney(Number(match[1].replace(/,/g, '')))],
  [/^(\d+(?:\.\d+)?)%$/, match => formatArabicPercent(Number(match[1]))],
  [/^You were born in (.+)\.$/, match => `وُلدت في ${translateArabicEntity(match[1])}.`],
  [/^You were born a (Male|Female) in a hospital\.$/, match =>
    match[1] === 'Male' ? 'وُلدت ذكرا في المستشفى.' : 'وُلدت أنثى في المستشفى.'],
  [/^You started studying (.+) at (.+)\.$/, match =>
    `بدأت دراسة ${translateArabicEntity(match[1])} في ${translateArabicEntity(match[2])}.`],
  [/^You graduated from (.+)!$/, match => `تخرجت من ${translateArabicEntity(match[1])}!`],
  [/^You were promoted to (.+)!$/, match => `تمت ترقيتك إلى ${translateArabicEntity(match[1])}!`],
  [/^You were fired from (.+)\.$/, match => `تم طردك من ${translateArabicEntity(match[1])}.`],
  [/^You found a new job as a (.+)\.$/, match => `وجدت وظيفة جديدة كـ${translateArabicEntity(match[1])}.`],
  [/^You started dating (.+)\.$/, match => `بدأت مواعدة ${match[1]}.`],
  [/^You broke up with (.+)\.$/, match => `انفصلت عن ${match[1]}.`],
  [/^You helped (.+) with \$([\d,]+)\.$/, match =>
    `ساعدت ${match[1]} بمبلغ ${formatArabicMoney(Number(match[2].replace(/,/g, '')))}.`],
  [/^(.+) asks you for \$([\d,]+)\.$/, match =>
    `يطلب منك ${match[1]} مبلغ ${formatArabicMoney(Number(match[2].replace(/,/g, '')))}.`],
  [/^You received \$([\d,]+) in unemployment support from (.+)\.$/, match =>
    `تلقيت ${formatArabicMoney(Number(match[1].replace(/,/g, '')))} كدعم للبطالة من ${translateArabicEntity(match[2])}.`],
  [/^(.+)'s tax rules adjusted your annual income tax to \$([\d,]+)\.$/, match =>
    `عدلت قوانين الضرائب في ${translateArabicEntity(match[1])} ضريبة دخلك السنوية إلى ${formatArabicMoney(Number(match[2].replace(/,/g, '')))}.`],
  [/^The standard retirement age in (.+) is (\d+)\.$/, match =>
    `سن التقاعد المعتاد في ${translateArabicEntity(match[1])} هو ${formatArabicNumber(Number(match[2]))}.`],
  [/^Campaign month (\d+): polling is at (\d+)%\./, match =>
    `الشهر ${formatArabicNumber(Number(match[1]))} من الحملة: تبلغ نسبة التأييد ${formatArabicPercent(Number(match[2]))}.`],
  [/^Pregnancy month (\d+):/, match => `الشهر ${formatArabicNumber(Number(match[1]))} من الحمل:`],
  [/^The court case has lasted (\d+) months\./, match =>
    `استمرت القضية ${formatArabicDuration(Number(match[1]), 'month')}.`],
  [/^War shortages increased your monthly costs by \$([\d,]+)\.$/, match =>
    `زادت أزمات الحرب نفقاتك الشهرية بمقدار ${formatArabicMoney(Number(match[1].replace(/,/g, '')))}.`],
  [/^(.+) declared war on (.+)\.$/, match =>
    `أعلنت ${translateArabicEntity(match[1])} الحرب على ${translateArabicEntity(match[2])}.`],
  [/^(.+) and (.+) signed a defensive alliance\.$/, match =>
    `وقعت ${translateArabicEntity(match[1])} و${translateArabicEntity(match[2])} تحالفا دفاعيا.`],
  [/^(.+) imposed sanctions on (.+)\.$/, match =>
    `فرضت ${translateArabicEntity(match[1])} عقوبات على ${translateArabicEntity(match[2])}.`],
  [/^(.+) won the election in (.+)\.$/, match =>
    `فاز ${match[1]} بالانتخابات في ${translateArabicEntity(match[2])}.`],
  [/^A coup removed (.+) from power in (.+)\.$/, match =>
    `أطاح انقلاب بـ${match[1]} من السلطة في ${translateArabicEntity(match[2])}.`],
  [/^A revolution began in (.+)\.$/, match =>
    `بدأت ثورة في ${translateArabicEntity(match[1])}.`],
  [/^(.+) moved to (.+) to start a new chapter\.$/, match =>
    `انتقل ${match[1]} إلى ${translateArabicEntity(match[2])} لبدء فصل جديد.`],
  [/^You chose: (.+)\.$/, match => `اخترت: ${translateArabicText(match[1], { recordLeak: false })}.`],
]);

function safeStorage() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

function readStoredLeaks() {
  const storage = safeStorage();
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(LEAK_STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredLeaks(leaks) {
  const storage = safeStorage();
  if (!storage) return;
  try {
    storage.setItem(LEAK_STORAGE_KEY, JSON.stringify(leaks.slice(0, MAX_LEAKS)));
  } catch {
    // Diagnostics must never interrupt gameplay.
  }
}

function normalize(value) {
  return String(value ?? '')
    .replace(/\s+AR(?=[.!?،؛:]?$)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function latinWordCount(value) {
  return (String(value).match(/[A-Za-z]{2,}/g) || []).length;
}

export function hasArabicText(value) {
  return ARABIC_RE.test(String(value ?? ''));
}

export function hasLatinText(value) {
  return LATIN_RE.test(String(value ?? ''));
}

export function isArabicPlaceholder(value, source = '') {
  const raw = String(value ?? '');
  const normalized = normalize(raw);
  const normalizedSource = normalize(source);
  return (
    PLACEHOLDER_AR_RE.test(raw) ||
    (normalizedSource && normalized === normalizedSource) ||
    (!hasArabicText(normalized) && hasLatinText(normalized))
  );
}

export function isCompleteArabicTranslation(value, source = '') {
  const normalized = normalize(value);
  if (!normalized || isArabicPlaceholder(value, source)) return false;
  if (!hasArabicText(normalized)) return false;
  // Names and abbreviations are allowed, but a sentence that remains mostly English is not.
  return latinWordCount(normalized) <= Math.max(2, Math.ceil(normalized.split(/\s+/).length * 0.3));
}

export function translateArabicEntity(value) {
  const text = normalize(value);
  return ENTITY_AR[text] || EXACT_AR[text] || text;
}

export function recordArabicLeak(value, context = 'runtime') {
  const text = normalize(value);
  if (!text || !hasLatinText(text) || /^https?:\/\//i.test(text)) return null;
  const leaks = readStoredLeaks();
  const existing = leaks.find(entry => entry.text === text && entry.context === context);
  if (existing) {
    existing.count = Math.max(1, Number(existing.count) || 1) + 1;
    existing.lastSeen = new Date().toISOString();
  } else {
    leaks.unshift({
      text,
      context,
      count: 1,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    });
  }
  writeStoredLeaks(leaks);
  return text;
}

export function getArabicLocalizationLeaks() {
  return readStoredLeaks();
}

export function clearArabicLocalizationLeaks() {
  writeStoredLeaks([]);
}

export function getArabicDigitStyle() {
  const storage = safeStorage();
  try {
    return storage?.getItem(DIGIT_STYLE_KEY) === 'arab' ? 'arab' : 'latn';
  } catch {
    return 'latn';
  }
}

export function setArabicDigitStyle(style) {
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem(DIGIT_STYLE_KEY, style === 'arab' ? 'arab' : 'latn');
}

export function formatArabicNumber(value, options = {}) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return String(value ?? '');
  return new Intl.NumberFormat('ar-MA-u-nu-' + getArabicDigitStyle(), {
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    ...options,
  }).format(numeric);
}

export function formatArabicMoney(value, currency = 'USD') {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return String(value ?? '');
  return new Intl.NumberFormat('ar-MA-u-nu-' + getArabicDigitStyle(), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(numeric);
}

export function formatArabicPercent(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return String(value ?? '');
  return new Intl.NumberFormat('ar-MA-u-nu-' + getArabicDigitStyle(), {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(numeric / 100);
}

export function formatArabicDuration(value, unit = 'year') {
  const count = Math.max(0, Math.floor(Number(value) || 0));
  const number = formatArabicNumber(count, { maximumFractionDigits: 0 });
  if (unit === 'month') {
    if (count === 0) return '0 شهر';
    if (count === 1) return 'شهر واحد';
    if (count === 2) return 'شهران';
    if (count >= 3 && count <= 10) return `${number} أشهر`;
    return `${number} شهرا`;
  }
  if (count === 0) return '0 سنة';
  if (count === 1) return 'سنة واحدة';
  if (count === 2) return 'سنتان';
  if (count >= 3 && count <= 10) return `${number} سنوات`;
  return `${number} سنة`;
}

export function translateArabicText(value, options = {}) {
  const text = normalize(value);
  if (!text || hasArabicText(text) && !isArabicPlaceholder(text)) return text;
  if (EXACT_AR[text]) return EXACT_AR[text];
  if (ENTITY_AR[text]) return ENTITY_AR[text];

  for (const [pattern, replacer] of PATTERN_AR) {
    const match = text.match(pattern);
    if (match) return replacer(match);
  }

  // Translate simple slash- or bullet-separated labels without damaging names.
  const separator = text.includes(' • ') ? ' • ' : text.includes(' / ') ? ' / ' : null;
  if (separator) {
    const parts = text.split(separator);
    const translated = parts.map(part => translateArabicText(part, { ...options, recordLeak: false }));
    if (translated.some((part, index) => part !== parts[index])) return translated.join(separator);
  }

  if (options.recordLeak !== false) recordArabicLeak(text, options.context || 'runtime');
  return options.unknownFallback || text;
}

export function localizeArabicCandidate(localizedValue, fallbackValue = '', context = 'runtime') {
  const localized = normalize(localizedValue);
  const fallback = normalize(fallbackValue);

  if (isCompleteArabicTranslation(localized, fallback)) return localized;

  const fromFallback = translateArabicText(fallback, { context, recordLeak: false });
  if (fromFallback && fromFallback !== fallback) return fromFallback;

  const fromLocalized = translateArabicText(localized, { context, recordLeak: false });
  if (fromLocalized && fromLocalized !== localized) return fromLocalized;

  recordArabicLeak(fallback || localized, context);
  return localized || fallback;
}

export function getArabicLocalizationDiagnostics() {
  const leaks = getArabicLocalizationLeaks();
  return {
    exactTranslations: Object.keys(EXACT_AR).length,
    entityTranslations: Object.keys(ENTITY_AR).length,
    dynamicPatterns: PATTERN_AR.length,
    runtimeLeaks: leaks.length,
    totalLeakOccurrences: leaks.reduce((sum, entry) => sum + Math.max(1, Number(entry.count) || 1), 0),
    digitStyle: getArabicDigitStyle(),
    leaks,
  };
}
