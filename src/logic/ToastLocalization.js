import { translateCountryName } from './i18n';
import { translateDeepSimulationText } from './DeepLocalization';
import { COUNTRY_NAME_AR } from './WorldSimulation2Data';

const ARABIC_TEXT = /[\u0600-\u06ff]/;
const EXTRA_COUNTRY_AR = Object.freeze({
  Egypt: 'مصر',
  Algeria: 'الجزائر',
  Tunisia: 'تونس',
  Libya: 'ليبيا',
  Mauritania: 'موريتانيا',
  Turkey: 'تركيا',
  Iran: 'إيران',
  Iraq: 'العراق',
  Jordan: 'الأردن',
  Lebanon: 'لبنان',
  Syria: 'سوريا',
  Palestine: 'فلسطين',
  Israel: 'إسرائيل',
  Qatar: 'قطر',
  Kuwait: 'الكويت',
  Bahrain: 'البحرين',
  Oman: 'عُمان',
  Yemen: 'اليمن',
  'South Africa': 'جنوب أفريقيا',
  Nigeria: 'نيجيريا',
  Kenya: 'كينيا',
});

export function getRuntimeLanguage() {
  try {
    return localStorage.getItem('pathbloom_language') === 'ar' ||
      localStorage.getItem('lifepath_language') === 'ar'
      ? 'ar'
      : 'en';
  } catch {
    return document.documentElement.lang?.startsWith('ar') ? 'ar' : 'en';
  }
}

function countryAr(name) {
  const cleaned = String(name || '').trim().replace(/[.!?]+$/, '');
  const baseTranslation = translateCountryName('ar', cleaned);
  if (baseTranslation && baseTranslation !== cleaned) return baseTranslation;
  return COUNTRY_NAME_AR[cleaned] || EXTRA_COUNTRY_AR[cleaned] || cleaned;
}

export function localizeToastMessage(message, language = getRuntimeLanguage()) {
  const source = String(message ?? '').trim();
  if (!source || language !== 'ar' || ARABIC_TEXT.test(source)) return source;

  let match = source.match(/^A devastating natural disaster has struck\s+(.+?)[.!]?$/i);
  if (match) return `ضربت كارثة طبيعية مدمرة ${countryAr(match[1])}.`;

  match = source.match(/^(.+?) declared war on (.+?)[.!]?$/i);
  if (match) return `أعلنت ${countryAr(match[1])} الحرب على ${countryAr(match[2])}.`;

  match = source.match(/^(.+?) imposed economic sanctions on (.+?)[.!]?$/i);
  if (match) return `فرضت ${countryAr(match[1])} عقوبات اقتصادية على ${countryAr(match[2])}.`;

  match = source.match(/^A military coup replaced the government of (.+?)[.!]?$/i);
  if (match) return `أطاح انقلاب عسكري بحكومة ${countryAr(match[1])}.`;

  match = source.match(/^Mass protests erupted in (.+?)[.!]?$/i);
  if (match) return `اندلعت احتجاجات واسعة في ${countryAr(match[1])}.`;

  const translated = translateDeepSimulationText(source, 'ar');
  return translated && translated !== source ? translated : source;
}
