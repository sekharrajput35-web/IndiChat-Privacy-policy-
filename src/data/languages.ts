export interface Language {
  code: string;
  name: string;
  nativeName: string;
  category: 'indian' | 'foreign';
  region: string;
  direction?: 'ltr' | 'rtl';
}

export const INDIAN_LANGUAGES: Language[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', category: 'indian', region: 'India (Official)' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', category: 'indian', region: 'West Bengal, Tripura' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', category: 'indian', region: 'Andhra Pradesh, Telangana' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', category: 'indian', region: 'Maharashtra' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', category: 'indian', region: 'Tamil Nadu, Puducherry' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', category: 'indian', region: 'India, Jammu & Kashmir', direction: 'rtl' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', category: 'indian', region: 'Gujarat' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', category: 'indian', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', category: 'indian', region: 'Kerala, Lakshadweep' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', category: 'indian', region: 'Odisha' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', category: 'indian', region: 'Punjab, Chandigarh' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', category: 'indian', region: 'Assam' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', category: 'indian', region: 'Bihar, Jharkhand' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', category: 'indian', region: 'Classical India' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', category: 'indian', region: 'Sikkim, West Bengal' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي / सिन्धी', category: 'indian', region: 'Gujarat, Maharashtra', direction: 'rtl' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', category: 'indian', region: 'Goa, Karnataka' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', category: 'indian', region: 'Jammu & Kashmir' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर / كٲشُر', category: 'indian', region: 'Jammu & Kashmir', direction: 'rtl' },
  { code: 'mni', name: 'Manipuri (Meitei)', nativeName: 'মৈতৈলোন্', category: 'indian', region: 'Manipur' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', category: 'indian', region: 'Assam, Bodoland' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', category: 'indian', region: 'Jharkhand, Odisha' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', category: 'indian', region: 'Bihar, Uttar Pradesh' },
];

export const FOREIGN_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', category: 'foreign', region: 'Global / International' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', category: 'foreign', region: 'Spain, Latin America' },
  { code: 'fr', name: 'French', nativeName: 'Français', category: 'foreign', region: 'France, Canada, Africa' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', category: 'foreign', region: 'Germany, Austria, Switzerland' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', category: 'foreign', region: 'Middle East, North Africa', direction: 'rtl' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', category: 'foreign', region: 'China, Singapore' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', category: 'foreign', region: 'Taiwan, Hong Kong' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', category: 'foreign', region: 'Japan' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', category: 'foreign', region: 'South Korea' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', category: 'foreign', region: 'Russia, Eastern Europe' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', category: 'foreign', region: 'Portugal, Brazil' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', category: 'foreign', region: 'Italy, Switzerland' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', category: 'foreign', region: 'Turkey' },
  { code: 'fa', name: 'Persian (Farsi)', nativeName: 'فارسی', category: 'foreign', region: 'Iran, Afghanistan', direction: 'rtl' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', category: 'foreign', region: 'Vietnam' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', category: 'foreign', region: 'Indonesia' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', category: 'foreign', region: 'Thailand' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', category: 'foreign', region: 'Netherlands, Belgium' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', category: 'foreign', region: 'Poland' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', category: 'foreign', region: 'Ukraine' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', category: 'foreign', region: 'Sweden' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', category: 'foreign', region: 'Greece, Cyprus' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', category: 'foreign', region: 'Israel', direction: 'rtl' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', category: 'foreign', region: 'Malaysia, Brunei' },
  { code: 'tl', name: 'Filipino / Tagalog', nativeName: 'Filipino', category: 'foreign', region: 'Philippines' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', category: 'foreign', region: 'Czech Republic' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', category: 'foreign', region: 'Romania, Moldova' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', category: 'foreign', region: 'Hungary' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', category: 'foreign', region: 'Denmark' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', category: 'foreign', region: 'Finland' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', category: 'foreign', region: 'Norway' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', category: 'foreign', region: 'East Africa' },
];

export const ALL_LANGUAGES: Language[] = [
  ...INDIAN_LANGUAGES,
  ...FOREIGN_LANGUAGES,
];

export const findLanguage = (code: string): Language => {
  return ALL_LANGUAGES.find((lang) => lang.code.toLowerCase() === code.toLowerCase()) || {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    category: 'foreign',
    region: 'Global / International',
  };
};

/**
 * Automatically detects the user's device / browser language
 * and matches it against supported Indian and Foreign languages.
 */
export const detectDeviceLanguage = (): Language => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return findLanguage('en');
  }

  // Collect candidate language codes from device in priority order
  const candidates: string[] = [];
  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    candidates.push(...navigator.languages);
  }
  if (navigator.language) {
    candidates.push(navigator.language);
  }
  if ((navigator as any).userLanguage) {
    candidates.push((navigator as any).userLanguage);
  }
  if ((navigator as any).browserLanguage) {
    candidates.push((navigator as any).browserLanguage);
  }

  for (const raw of candidates) {
    if (!raw || typeof raw !== 'string') continue;
    const tag = raw.trim().toLowerCase();

    // 1. Direct match (e.g. 'zh-cn', 'zh-tw', 'hi', 'bn', 'es')
    const direct = ALL_LANGUAGES.find((l) => l.code.toLowerCase() === tag);
    if (direct) return direct;

    // 2. Base code match (e.g. 'hi-in' -> 'hi', 'mr-in' -> 'mr', 'ta-in' -> 'ta', 'fr-ca' -> 'fr')
    const base = tag.split('-')[0].split('_')[0];
    const baseMatch = ALL_LANGUAGES.find((l) => l.code.toLowerCase() === base);
    if (baseMatch) return baseMatch;

    // 3. Aliases and dialect mappings
    if (tag.startsWith('zh')) {
      if (tag.includes('tw') || tag.includes('hk') || tag.includes('mo') || tag.includes('hant')) {
        return findLanguage('zh-TW');
      }
      return findLanguage('zh-CN');
    }
    if (tag.startsWith('fil')) return findLanguage('tl');
    if (base === 'in') return findLanguage('id'); // Indonesian old ISO
    if (base === 'iw') return findLanguage('he'); // Hebrew old ISO
    if (base === 'ji') return findLanguage('he');
    if (base === 'pan') return findLanguage('pa'); // Punjabi
    if (base === 'ben') return findLanguage('bn'); // Bengali
    if (base === 'guj') return findLanguage('gu'); // Gujarati
    if (base === 'kan') return findLanguage('kn'); // Kannada
    if (base === 'mal') return findLanguage('ml'); // Malayalam
    if (base === 'mar') return findLanguage('mr'); // Marathi
    if (base === 'tam') return findLanguage('ta'); // Tamil
    if (base === 'tel') return findLanguage('te'); // Telugu
    if (base === 'urd') return findLanguage('ur'); // Urdu
    if (base === 'hin') return findLanguage('hi'); // Hindi
  }

  return findLanguage('en');
};
