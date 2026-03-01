"use client";

import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import styles from "./AnatomyMap.module.css";
import { useTranslation } from "react-i18next";

const anatomicalCategories = [
    {
        name: "Neck & Shoulders",
        muscles: ["Left Sternocleidomastoid (Neck)", "Right Sternocleidomastoid (Neck)", "Left Trapezius", "Right Trapezius", "Left Front Deltoid", "Right Front Deltoid", "Left Infraspinatus", "Right Infraspinatus"]
    },
    {
        name: "Chest & Back",
        muscles: ["Left Pectoralis Major", "Right Pectoralis Major", "Left Latissimus Dorsi", "Right Latissimus Dorsi", "Lower Back (Erector Spinae)"]
    },
    {
        name: "Arms",
        muscles: ["Left Biceps Brachii", "Right Biceps Brachii", "Left Triceps Brachii", "Right Triceps Brachii"]
    },
    {
        name: "Core",
        muscles: ["Rectus Abdominis (Abs)", "Left External Oblique", "Right External Oblique", "Left Internal Oblique", "Right Internal Oblique"]
    },
    {
        name: "Hips & Glutes",
        muscles: ["Left Gluteus Medius", "Right Gluteus Medius", "Left Gluteus Maximus", "Right Gluteus Maximus"]
    },
    {
        name: "Upper Legs",
        muscles: ["Left Sartorius", "Right Sartorius", "Left Rectus Femoris (Quad)", "Right Rectus Femoris (Quad)", "Left Vastus Lateralis", "Right Vastus Lateralis", "Left Vastus Medialis", "Right Vastus Medialis", "Left Hamstring", "Right Hamstring"]
    },
    {
        name: "Lower Legs",
        muscles: ["Left Tibialis Anterior", "Right Tibialis Anterior", "Left Gastrocnemius (Calf)", "Right Gastrocnemius (Calf)", "Left Soleus", "Right Soleus"]
    },
    {
        name: "Tendons & Ligaments",
        muscles: ["Left Patellar Tendon", "Right Patellar Tendon", "Left Achilles Tendon", "Right Achilles Tendon"]
    },
    {
        name: "Other Specific Areas",
        muscles: ["Groin / Perineal Area", "Hands / Wrists", "Feet / Toes"]
    }
];

// Coords scaled for the 1304 x 3033 vertically stacked image
// Anterior (Front) is on top (0% to ~50%)
// Posterior (Back) is on bottom (~50% to 100%)
const anatomyNodes = [
    // --- Anterior (Front view) - Top Half (0% to 50%) ---
    { id: "Left Sternocleidomastoid (Neck)", x: 52, y: 7.5 },
    { id: "Right Sternocleidomastoid (Neck)", x: 48, y: 7.5 },
    { id: "Left Front Deltoid", x: 64.5, y: 11.5 },
    { id: "Right Front Deltoid", x: 35.5, y: 11.5 },
    { id: "Left Pectoralis Major", x: 57, y: 13.5 },
    { id: "Right Pectoralis Major", x: 43, y: 13.5 },
    { id: "Left Biceps Brachii", x: 67, y: 17.5 },
    { id: "Right Biceps Brachii", x: 33, y: 17.5 },
    { id: "Rectus Abdominis (Abs)", x: 50, y: 20 },
    { id: "Left External Oblique", x: 57, y: 22 },
    { id: "Right External Oblique", x: 43, y: 22 },
    { id: "Left Sartorius", x: 60, y: 31 },
    { id: "Right Sartorius", x: 40, y: 31 },
    { id: "Left Rectus Femoris (Quad)", x: 60, y: 35 },
    { id: "Right Rectus Femoris (Quad)", x: 40, y: 35 },
    { id: "Left Vastus Lateralis", x: 64.5, y: 36.5 },
    { id: "Right Vastus Lateralis", x: 35.5, y: 36.5 },
    { id: "Left Vastus Medialis", x: 55, y: 39 },
    { id: "Right Vastus Medialis", x: 45, y: 39 },
    { id: "Left Patellar Tendon", x: 57.5, y: 41 },
    { id: "Right Patellar Tendon", x: 42.5, y: 41 },
    { id: "Left Tibialis Anterior", x: 58, y: 44.5 },
    { id: "Right Tibialis Anterior", x: 42, y: 44.5 },

    // --- Posterior (Back view) - Bottom Half (50% to 100%) ---
    { id: "Left Trapezius", x: 42, y: 58.5 },
    { id: "Right Trapezius", x: 58, y: 58.5 },
    { id: "Left Infraspinatus", x: 38, y: 62 },
    { id: "Right Infraspinatus", x: 62, y: 62 },
    { id: "Left Triceps Brachii", x: 31, y: 66 },
    { id: "Right Triceps Brachii", x: 69, y: 66 },
    { id: "Left Latissimus Dorsi", x: 42, y: 67.5 },
    { id: "Right Latissimus Dorsi", x: 58, y: 67.5 },
    { id: "Lower Back (Erector Spinae)", x: 50, y: 70 },
    { id: "Left Gluteus Medius", x: 42, y: 73 },
    { id: "Right Gluteus Medius", x: 58, y: 73 },
    { id: "Left Gluteus Maximus", x: 44, y: 76 },
    { id: "Right Gluteus Maximus", x: 56, y: 76 },
    { id: "Left Hamstring", x: 43.5, y: 83 },
    { id: "Right Hamstring", x: 56.5, y: 83 },
    { id: "Left Gastrocnemius (Calf)", x: 44, y: 92 },
    { id: "Right Gastrocnemius (Calf)", x: 56, y: 92 },
    { id: "Left Soleus", x: 42.5, y: 94.5 },
    { id: "Right Soleus", x: 57.5, y: 94.5 },
    { id: "Left Achilles Tendon", x: 45, y: 97.5 },
    { id: "Right Achilles Tendon", x: 55, y: 97.5 },
];

export function AnatomyMap({
    onPartClick,
    selectedParts,
}: {
    onPartClick: (partId: string) => void;
    selectedParts: string[];
}) {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <div className={styles.instructions}>
                Use the image on the left to identify the muscle name, then click it in the list on the right.
            </div>

            <div className={styles.splitLayout}>
                {/* Left Side: Medical Image Reference */}
                <div className={styles.imageViewerPane}>
                    <TransformWrapper
                        initialScale={1}
                        minScale={0.5}
                        maxScale={4}
                        centerOnInit
                        limitToBounds={false}
                    >
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                                <div className={styles.controls}>
                                    <button className={styles.controlBtn} onClick={() => zoomIn()} title="Zoom In">
                                        <ZoomIn size={18} />
                                    </button>
                                    <button className={styles.controlBtn} onClick={() => zoomOut()} title="Zoom Out">
                                        <ZoomOut size={18} />
                                    </button>
                                    <button className={styles.controlBtn} onClick={() => resetTransform()} title="Reset">
                                        <Maximize size={18} />
                                    </button>
                                </div>
                                <div className={styles.mapWrapper}>
                                    <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                                        <div className={styles.imageContainer}>
                                            <img
                                                src="/muscle-system.jpg"
                                                alt="High-Fidelity Muscular System Reference"
                                                className={styles.baseImage}
                                            />
                                            {anatomyNodes.map((node) => {
                                                const isSelected = selectedParts.includes(node.id);
                                                return (
                                                    <div
                                                        key={`${node.id}-${node.x}-${node.y}`}
                                                        className={`${styles.node} ${isSelected ? styles.nodeSelected : ""}`}
                                                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onPartClick(node.id);
                                                        }}
                                                    >
                                                        <div className={styles.tooltip}>{node.id}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </TransformComponent>
                                </div>
                            </>
                        )}
                    </TransformWrapper>
                </div>

                {/* Right Side: Categorized Selection List */}
                <div className={styles.selectionPane}>
                    <h3 className={styles.selectionTitle}>Select Precise Area</h3>
                    <div className={styles.categoryList}>
                        {anatomicalCategories.map((category) => (
                            <div key={category.name} className={styles.categoryGroup}>
                                <h4 className={styles.categoryName}>{category.name}</h4>
                                <div className={styles.buttonGrid}>
                                    {category.muscles.map((muscle) => {
                                        const isSelected = selectedParts.includes(muscle);
                                        return (
                                            <button
                                                key={muscle}
                                                className={`${styles.muscleBtn} ${isSelected ? styles.muscleBtnSelected : ""}`}
                                                onClick={() => onPartClick(muscle)}
                                            >
                                                {muscle}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
