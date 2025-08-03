import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ar from "./ar.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
    },
    fallbackLng: "ar", // fallback to Arabic if not detected
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
