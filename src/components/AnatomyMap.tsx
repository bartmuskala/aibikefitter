"use client";

import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import styles from "./AnatomyMap.module.css";
import { useTranslation } from "react-i18next";

// Highly precise anatomical nodes mapped to the muscle-system.svg illustration
// (x,y are percentages from top left of the image)
const anatomyNodes = [
    // --- Posterior (Back view) - Left side of image ---
    { id: "Left Trapezius", x: 23, y: 18 },
    { id: "Right Trapezius", x: 33, y: 18 },
    { id: "Left Infraspinatus", x: 21, y: 24 },
    { id: "Right Infraspinatus", x: 35, y: 24 },
    { id: "Left Triceps Brachii", x: 19, y: 32 },
    { id: "Right Triceps Brachii", x: 37, y: 32 },
    { id: "Left Latissimus Dorsi", x: 25, y: 35 },
    { id: "Right Latissimus Dorsi", x: 32, y: 35 },
    { id: "Lower Back (Erector Spinae)", x: 28, y: 41 },
    { id: "Left Gluteus Medius", x: 22, y: 46 },
    { id: "Right Gluteus Medius", x: 34, y: 46 },
    { id: "Left Gluteus Maximus", x: 23, y: 50 },
    { id: "Right Gluteus Maximus", x: 34, y: 50 },
    { id: "Left Hamstring (Biceps Femoris)", x: 24, y: 64 },
    { id: "Right Hamstring (Biceps Femoris)", x: 33, y: 64 },
    { id: "Left Gastrocnemius (Calf)", x: 22, y: 80 },
    { id: "Right Gastrocnemius (Calf)", x: 35, y: 80 },
    { id: "Left Soleus", x: 23, y: 86 },
    { id: "Right Soleus", x: 34, y: 86 },
    { id: "Left Achilles Tendon", x: 22, y: 92 },
    { id: "Right Achilles Tendon", x: 35, y: 92 },

    // --- Anterior (Front view) - Right side of image ---
    { id: "Neck (Sternocleidomastoid)", x: 74, y: 13 },
    { id: "Left Front Deltoid", x: 80, y: 20 },
    { id: "Right Front Deltoid", x: 67, y: 20 },
    { id: "Left Pectoralis Major", x: 81, y: 24 },
    { id: "Right Pectoralis Major", x: 65, y: 24 },
    { id: "Left Biceps Brachii", x: 84, y: 30 },
    { id: "Right Biceps Brachii", x: 62, y: 30 },
    { id: "Rectus Abdominis (Abs)", x: 73, y: 36 },
    { id: "Left External Oblique", x: 81, y: 38 },
    { id: "Right External Oblique", x: 65, y: 38 },
    { id: "Left Sartorius", x: 80, y: 51 },
    { id: "Right Sartorius", x: 67, y: 51 },
    { id: "Left Rectus Femoris (Quad)", x: 81, y: 60 },
    { id: "Right Rectus Femoris (Quad)", x: 65, y: 60 },
    { id: "Left Vastus Lateralis (Outer Quad)", x: 84, y: 62 },
    { id: "Right Vastus Lateralis (Outer Quad)", x: 62, y: 62 },
    { id: "Left Vastus Medialis (Inner Quad)", x: 77, y: 68 },
    { id: "Right Vastus Medialis (Inner Quad)", x: 69, y: 68 },
    { id: "Left Patellar Tendon", x: 80, y: 73 },
    { id: "Right Patellar Tendon", x: 66, y: 73 },
    { id: "Left Tibialis Anterior (Shin)", x: 80, y: 82 },
    { id: "Right Tibialis Anterior (Shin)", x: 66, y: 82 },
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
                {t("click_muscle")}
            </div>

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
                                        src="/muscle-system.svg"
                                        alt="High-Fidelity Muscular System Anatomy Map"
                                        className={styles.baseImage}
                                    />
                                    {anatomyNodes.map((node) => {
                                        const isSelected = selectedParts.includes(node.id);
                                        return (
                                            <div
                                                key={node.id}
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
    );
}
