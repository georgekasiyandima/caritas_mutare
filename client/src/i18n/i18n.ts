import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import sh from './locales/sh.json';

const resources = {
  en: {
    translation: en,
  },
  sh: {
    translation: sh,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    // Bundled translations are ready on import. Do not suspend the whole
    // tree (that is the full-page "Loading Caritas Mutare…" spinner).
    react: {
      useSuspense: false,
    },
  });

export default i18n;





