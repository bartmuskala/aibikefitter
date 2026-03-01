"use client";

import React from "react";
import Model, { IExerciseData, IMuscleStats } from "@phelian/react-body-highlighter";
import styles from "./AnatomyMap.module.css";
import { useTranslation } from "react-i18next";

export function AnatomyMap({
    onPartClick,
    selectedParts,
}: {
    onPartClick: (partId: string) => void;
    selectedParts: string[];
}) {
    const { t } = useTranslation();

    const handleClick = (muscleStats: IMuscleStats) => {
        // muscleStats.muscle is the raw string ID like "quadriceps" or "calves"
        onPartClick(muscleStats.muscle);
    };

    // Format selected parts so the model highlights them
    // react-body-highlighter uses an array of "exercises" to calculate how many times a muscle is hit.
    // Here we just map our selected parts to a single mock exercise to trigger frequency=1.
    const highlightData: IExerciseData[] = [
        {
            name: "Current Pain Points",
            muscles: selectedParts as any[],
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.instructions}>
                {t("click_muscle")}
            </div>
            <div className={styles.mapWrapper}>
                <div className={styles.modelContainer}>
                    <p className={styles.modelLabel}>Front (Anterior)</p>
                    <Model
                        type="anterior"
                        data={highlightData}
                        highlightedColors={["#ef4444"]} // Bright red for selected
                        bodyColor="#e5e7eb" // Light grey for rest of the body
                        onClick={handleClick as any}
                        svgStyle={{ height: "45vh" }}
                    />
                </div>
                <div className={styles.modelContainer}>
                    <p className={styles.modelLabel}>Back (Posterior)</p>
                    <Model
                        type="posterior"
                        data={highlightData}
                        highlightedColors={["#ef4444"]} // Bright red for selected
                        bodyColor="#e5e7eb" // Light grey for rest of the body
                        onClick={handleClick as any}
                        svgStyle={{ height: "45vh" }}
                    />
                </div>
            </div>
        </div>
    );
}
