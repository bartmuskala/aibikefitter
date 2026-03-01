"use client";

import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.css";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === "en" ? "nl" : "en";
        i18n.changeLanguage(nextLang);
    };

    return (
        <button className={styles.langBtn} onClick={toggleLanguage}>
            {i18n.language.toUpperCase()}
        </button>
    );
}
