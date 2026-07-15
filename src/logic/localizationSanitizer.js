const AR_TEXT_OVERRIDES = {
  'You have a splitting migraine.': 'لديك صداع نصفي شديد.',
  'You have a splitting migraine': 'لديك صداع نصفي شديد.',
  'You have caught a nasty cold.': 'أصبت بزكام مزعج.',
  'You are experiencing severe chest pains.': 'تشعر بآلام شديدة في صدرك.',
  'You caught the Chicken Pox. You are incredibly itchy.': 'أصبت بجدري الماء وتشعر بحكة شديدة.',
  'You got curious in art class and ate a stick of glue.': 'دفعك الفضول في حصة الفن فأكلت عصا غراء.',
  'A bird pooped directly on your head.': 'سقط فضلات طائر مباشرة على رأسك.',
};

function normalizeText(value) {
  return String(value ?? '')
    .replace(/\s+AR\s*$/i, '')
    .replace(/\s+AR(?=[.!?،؛:]?$)/i, '')
    .trim();
}

export function cleanLocalizedText(localizedValue, fallbackValue = '', language = 'en') {
  const localized = normalizeText(localizedValue);

  if (language !== 'ar') {
    return localized;
  }

  const fallback = normalizeText(fallbackValue);
  if (fallback && AR_TEXT_OVERRIDES[fallback]) {
    const wasPlaceholderArabic = /\s+AR\s*$/i.test(String(localizedValue ?? ''));
    const sameAsFallback = localized === fallback;
    if (wasPlaceholderArabic || sameAsFallback) {
      return AR_TEXT_OVERRIDES[fallback];
    }
  }

  if (AR_TEXT_OVERRIDES[localized]) {
    return AR_TEXT_OVERRIDES[localized];
  }

  return localized;
}
