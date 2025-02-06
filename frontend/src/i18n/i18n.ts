import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';

// Import translation files
import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';

const resources = {
  en: {
    translation: enTranslation
  },
  hi: {
    translation: hiTranslation
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect user language
  .use(XHR)               // Load translation files if needed
  .use(initReactI18next)  // Pass i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Default language
    debug: true, // Set to false in production
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
