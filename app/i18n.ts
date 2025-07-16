import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import nextI18NextConfig from "../next-i18next.config.js";

// Для CSR: підключаємо бекенд та детектор мови
if (!i18n.isInitialized) {
    i18n.use(HttpBackend)
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            ...nextI18NextConfig.i18n,
            fallbackLng: nextI18NextConfig.i18n.defaultLocale,
            supportedLngs: nextI18NextConfig.i18n.locales,
            backend: {
                loadPath: "/locales/{{lng}}/{{ns}}.json",
            },
            ns: ["common"],
            defaultNS: "common",
            react: { useSuspense: false },
            interpolation: { escapeValue: false },
            detection: {
                order: ["localStorage", "navigator", "htmlTag"],
                caches: ["localStorage"],
            },
        });
}

export default i18n;
