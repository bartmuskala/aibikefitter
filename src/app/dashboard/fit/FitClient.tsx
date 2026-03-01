"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { AnatomyMap } from "@/components/AnatomyMap";
import { PainInputModal, PainData } from "@/components/PainInputModal";

export default function FitClient() {
    const { t } = useTranslation();
    const router = useRouter();
    const [painPoints, setPainPoints] = useState<PainData[]>([]);
    const [activePart, setActivePart] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handlePartClick = (partId: string) => {
        setActivePart(partId);
    };

    const handleSavePain = (data: PainData) => {
        // If the part is already there, replace it, otherwise add
        setPainPoints((prev) => {
            const filtered = prev.filter((p) => p.partId !== data.partId);
            return [...filtered, data];
        });
        setActivePart(null);
    };

    const handleRemovePain = (partId: string) => {
        setPainPoints((prev) => prev.filter((p) => p.partId !== partId));
    };

    const handleGetAdvice = async () => {
        if (painPoints.length === 0) return;

        setLoading(true);
        try {
            const res = await fetch("/api/gemini/advice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ painPoints })
            });

            if (!res.ok) throw new Error("Failed to get advice");

            const data = await res.json();
            router.push(`/dashboard/fit/${data.id}`);
        } catch (error) {
            console.error(error);
            alert(t("error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t("select_pain_points")}</h1>

            <div className={styles.editor}>
                <div className={styles.modelWrapper}>
                    <AnatomyMap
                        onPartClick={handlePartClick}
                        selectedParts={painPoints.map((p) => p.partId)}
                    />
                </div>

                <div className={styles.sidebar}>
                    <h2 className={styles.sidebarTitle}>Selected Pain Points</h2>
                    {painPoints.length === 0 ? (
                        <p className={styles.empty}>No pain points selected. Click on the anatomy map.</p>
                    ) : (
                        <ul className={styles.pointList}>
                            {painPoints.map((p) => (
                                <li key={p.partId} className={styles.pointItem}>
                                    <div>
                                        <strong>{p.partId}</strong> (Level {p.level})
                                        <div className={styles.timingBadge}>
                                            Timing: {p.timing.replace('_', ' ')}
                                        </div>
                                        {p.remarks && <p className={styles.remark}>{p.remarks}</p>}
                                    </div>
                                    <button className={styles.removeBtn} onClick={() => handleRemovePain(p.partId)}>✕</button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        className={styles.adviceBtn}
                        disabled={painPoints.length === 0 || loading}
                        onClick={handleGetAdvice}
                    >
                        {loading ? t("loading") : t("get_advice")}
                    </button>
                </div>
            </div>

            {activePart && (
                <PainInputModal
                    partId={activePart}
                    onSave={handleSavePain}
                    onCancel={() => setActivePart(null)}
                />
            )}
        </div>
    );
}
