import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, findLanguage, detectDeviceLanguage, ALL_LANGUAGES } from '../data/languages';

interface LanguageContextType {
  currentLanguage: Language;
  deviceLanguage: Language;
  isAutoDetect: boolean;
  changeLanguage: (code: string, isManualOverride?: boolean) => void;
  enableAutoDetect: () => void;
  toggleEnglishHindi: () => void;
  isLanguageModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'indichat_user_language';
const LANGUAGE_MODE_KEY = 'indichat_language_mode'; // 'auto' | 'manual'

// Helper to set Google Translate cookie for all relevant domains
const setGoogleTranslateCookie = (langCode: string) => {
  const host = window.location.hostname;
  if (langCode === 'en') {
    // Clear cookie to reset to native English
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
    document.cookie = `googtrans=/en/en; path=/;`;
    document.cookie = `googtrans=/en/en; path=/; domain=${host};`;
  } else {
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${host};`;
  }
};

// Helper to apply translation via Google Translate widget combo
const triggerGoogleTranslateCombo = (langCode: string): boolean => {
  try {
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
      return true;
    }
  } catch (err) {
    console.warn('Google Translate combo error:', err);
  }
  return false;
};

// Ensure Google Translate script is loaded
const ensureGoogleTranslateScript = (onLoaded?: () => void) => {
  if (typeof window === 'undefined') return;

  // Check if already loaded
  if ((window as any).google?.translate?.TranslateElement) {
    onLoaded?.();
    return;
  }

  // Create init function on window if not present
  (window as any).googleTranslateElementInit = () => {
    try {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
          layout: (window as any).google.translate.TranslateElement.InlineLayout?.HORIZONTAL,
        },
        'google_translate_element'
      );
      onLoaded?.();
    } catch (e) {
      console.warn('TranslateElement init warning:', e);
    }
  };

  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check if device language should be used (default to auto-detecting user's device)
  const [isAutoDetect, setIsAutoDetect] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const mode = localStorage.getItem(LANGUAGE_MODE_KEY);
      if (mode === 'manual') return false;
      return true; // Default to automatic device detection
    }
    return true;
  });

  // Keep track of current device language
  const [deviceLanguage, setDeviceLanguage] = useState<Language>(() => detectDeviceLanguage());

  // Determine initial language: if manual preference exists and mode is manual, use it; otherwise auto-detect from device!
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const mode = localStorage.getItem(LANGUAGE_MODE_KEY);
      if (mode === 'manual') {
        const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (saved) return findLanguage(saved);
      }
    }
    // Auto-detect from user's device
    return detectDeviceLanguage();
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Apply language change to DOM and translation engine
  const applyLanguage = useCallback((target: Language) => {
    setIsTranslating(true);
    setCurrentLanguage(target);

    // Set document lang & direction
    document.documentElement.lang = target.code;
    if (target.direction === 'rtl') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }

    setGoogleTranslateCookie(target.code);

    const triggered = triggerGoogleTranslateCombo(target.code);
    if (!triggered) {
      ensureGoogleTranslateScript(() => {
        setTimeout(() => {
          triggerGoogleTranslateCombo(target.code);
          setIsTranslating(false);
        }, 500);
      });
    } else {
      setTimeout(() => {
        setIsTranslating(false);
      }, 400);
    }
  }, []);

  // Initialize on mount: ensure container, load translate engine, and apply detected device language
  useEffect(() => {
    if (!document.getElementById('google_translate_element')) {
      const div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.display = 'none';
      document.body.appendChild(div);
    }

    const detected = detectDeviceLanguage();
    setDeviceLanguage(detected);

    const mode = localStorage.getItem(LANGUAGE_MODE_KEY);
    const targetLang = (mode === 'manual')
      ? findLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en')
      : detected;

    ensureGoogleTranslateScript(() => {
      if (targetLang.code !== 'en') {
        setTimeout(() => {
          applyLanguage(targetLang);
        }, 600);
      }
    });

    // Listen to device / browser language change event in real time!
    const handleDeviceLanguageChange = () => {
      const newDevLang = detectDeviceLanguage();
      setDeviceLanguage(newDevLang);
      // If in auto mode, update language immediately to match new device setting
      const currentMode = localStorage.getItem(LANGUAGE_MODE_KEY);
      if (currentMode !== 'manual') {
        applyLanguage(newDevLang);
      }
    };

    window.addEventListener('languagechange', handleDeviceLanguageChange);
    return () => window.removeEventListener('languagechange', handleDeviceLanguageChange);
  }, [applyLanguage]);

  const changeLanguage = (code: string, isManualOverride: boolean = true) => {
    const target = findLanguage(code);
    if (isManualOverride) {
      setIsAutoDetect(false);
      try {
        localStorage.setItem(LANGUAGE_MODE_KEY, 'manual');
        localStorage.setItem(LANGUAGE_STORAGE_KEY, target.code);
      } catch (e) {
        // Ignore storage errors
      }
    }
    applyLanguage(target);
  };

  // Re-enable device automatic detection
  const enableAutoDetect = () => {
    setIsAutoDetect(true);
    try {
      localStorage.setItem(LANGUAGE_MODE_KEY, 'auto');
      localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    } catch (e) {
      // Ignore storage errors
    }
    const detected = detectDeviceLanguage();
    setDeviceLanguage(detected);
    applyLanguage(detected);
  };

  const toggleEnglishHindi = () => {
    if (currentLanguage.code === 'hi') {
      changeLanguage('en', true);
    } else {
      changeLanguage('hi', true);
    }
  };

  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        deviceLanguage,
        isAutoDetect,
        changeLanguage,
        enableAutoDetect,
        toggleEnglishHindi,
        isLanguageModalOpen,
        openLanguageModal,
        closeLanguageModal,
        isTranslating,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

