"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import styles from "./page.module.css";
import { BikeFitAdvice } from "@prisma/client";

export default function DashboardClient({ initialHistory }: { initialHistory: BikeFitAdvice[] }) {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h1 className={styles.title}>{t("your_history")}</h1>
                <Link href="/dashboard/fit" className={styles.newFitBtn}>
                    {t("new_fit")}
                </Link>
            </div>

            <div className={styles.historyGrid}>
                {initialHistory.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>{t("no_history")}</p>
                    </div>
                ) : (
                    initialHistory.map((fit) => (
                        <div key={fit.id} className={styles.historyCard}>
                            <div className={styles.cardHeader}>
                                <span className={styles.date}>{new Date(fit.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.cardBody}>
                                {/* We can parse painPoints to show a brief summary */}
                                <p className={styles.summary}>
                                    {fit.advice.substring(0, 150)}...
                                </p>
                            </div>
                            <div className={styles.cardFooter}>
                                <Link href={`/dashboard/fit/${fit.id}`} className={styles.viewBtn}>
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
