"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import styles from "./PainInputModal.module.css";

export type PainData = {
    partId: string;
    level: number;
    timing: string;
    remarks: string;
};

export function PainInputModal({
    partId,
    onSave,
    onCancel,
}: {
    partId: string;
    onSave: (data: PainData) => void;
    onCancel: () => void;
}) {
    const { t } = useTranslation();
    const [level, setLevel] = useState<number>(3);
    const [timing, setTiming] = useState<string>("during");
    const [remarks, setRemarks] = useState("");

    const handleSave = () => {
        onSave({ partId, level, timing, remarks });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3 className={styles.title}>{t("add_pain_point")}: {partId}</h3>

                <div className={styles.field}>
                    <label>{t("pain_level")}: <strong>{level}</strong></label>
                    <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value))}
                        className={styles.slider}
                    />
                    <div className={styles.labels}>
                        <span>1 (Mild)</span>
                        <span>5 (Severe)</span>
                    </div>
                </div>

                <div className={styles.field}>
                    <label>{t("pain_timing") || "When does it occur?"}</label>
                    <select
                        className={styles.select}
                        value={timing}
                        onChange={(e) => setTiming(e.target.value)}
                    >
                        <option value="during">{t("timing_during") || "During the ride"}</option>
                        <option value="soon_after">{t("timing_soon_after") || "Soon after the ride (within hours)"}</option>
                        <option value="days_after">{t("timing_days_after") || "Days after the ride"}</option>
                    </select>
                </div>

                <div className={styles.field}>
                    <label>{t("remarks_optional")}</label>
                    <textarea
                        className={styles.textarea}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="E.g., Only happens after 2 hours..."
                        rows={3}
                    />
                </div>

                <div className={styles.actions}>
                    <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
                    <button className={styles.saveBtn} onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}
