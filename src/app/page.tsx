"use client";

import styles from "./page.module.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthButton from "@/components/AuthButton";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      {/* Decorative blurred shapes */}
      <div className={`${styles.glassCard} ${styles.card1}`} />
      <div className={`${styles.glassCard} ${styles.card2}`} />

      <header className={styles.header}>
        <LanguageSwitcher />
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>{t("app_title")}</h1>
        <p className={styles.subtitle}>
          {t("subtitle")}
        </p>
        <div className={styles.authWrapper}>
          <AuthButton />
        </div>
      </main>
    </div>
  );
}
