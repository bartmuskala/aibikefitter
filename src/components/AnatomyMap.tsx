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
    // --- Anterior (Front view) - Top Half ---
    { id: "Left Sternocleidomastoid (Neck)", x: 50, y: 7 },
    { id: "Right Sternocleidomastoid (Neck)", x: 50, y: 7 }, // Neck isn't easily split visually on this diagram
    { id: "Left Front Deltoid", x: 62, y: 11 },
    { id: "Right Front Deltoid", x: 38, y: 11 },
    { id: "Left Pectoralis Major", x: 58, y: 14 },
    { id: "Right Pectoralis Major", x: 42, y: 14 },
    { id: "Left Biceps Brachii", x: 68, y: 19 },
    { id: "Right Biceps Brachii", x: 32, y: 19 },
    { id: "Rectus Abdominis (Abs)", x: 50, y: 22 },
    { id: "Left External Oblique", x: 58, y: 23 },
    { id: "Right External Oblique", x: 42, y: 23 },
    { id: "Left Sartorius", x: 57, y: 31 },
    { id: "Right Sartorius", x: 43, y: 31 },
    { id: "Left Rectus Femoris (Quad)", x: 58, y: 35 },
    { id: "Right Rectus Femoris (Quad)", x: 42, y: 35 },
    { id: "Left Vastus Lateralis", x: 63, y: 36 },
    { id: "Right Vastus Lateralis", x: 37, y: 36 },
    { id: "Left Vastus Medialis", x: 54, y: 38 },
    { id: "Right Vastus Medialis", x: 46, y: 38 },
    { id: "Left Patellar Tendon", x: 56, y: 41 },
    { id: "Right Patellar Tendon", x: 44, y: 41 },
    { id: "Left Tibialis Anterior", x: 56, y: 45 },
    { id: "Right Tibialis Anterior", x: 44, y: 45 },

    // --- Posterior (Back view) - Bottom Half ---
    { id: "Left Trapezius", x: 43, y: 58 },
    { id: "Right Trapezius", x: 57, y: 58 },
    { id: "Left Infraspinatus", x: 40, y: 61 },
    { id: "Right Infraspinatus", x: 60, y: 61 },
    { id: "Left Triceps Brachii", x: 32, y: 65 },
    { id: "Right Triceps Brachii", x: 68, y: 65 },
    { id: "Left Latissimus Dorsi", x: 42, y: 66 },
    { id: "Right Latissimus Dorsi", x: 58, y: 66 },
    { id: "Lower Back (Erector Spinae)", x: 50, y: 70 },
    { id: "Left Gluteus Medius", x: 42, y: 72 },
    { id: "Right Gluteus Medius", x: 58, y: 72 },
    { id: "Left Gluteus Maximus", x: 44, y: 75 },
    { id: "Right Gluteus Maximus", x: 56, y: 75 },
    { id: "Left Hamstring", x: 44, y: 82 },
    { id: "Right Hamstring", x: 56, y: 82 },
    { id: "Left Gastrocnemius (Calf)", x: 44, y: 91 },
    { id: "Right Gastrocnemius (Calf)", x: 56, y: 91 },
    { id: "Left Soleus", x: 42, y: 94 },
    { id: "Right Soleus", x: 58, y: 94 },
    { id: "Left Achilles Tendon", x: 45, y: 97 },
    { id: "Right Achilles Tendon", x: 55, y: 97 },
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
