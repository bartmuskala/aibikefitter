"use client";

import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";
import styles from "./AnatomyMap.module.css";

// Coords are percentages (x = left, y = top) mapping to a standard side-by-side anatomy illustration
const anatomyNodes = [
    // --- Posterior (Back view) - Left side of image ---
    { id: "Left Trapezius", x: 23, y: 18 },
    { id: "Right Trapezius", x: 33, y: 18 },
    { id: "Lower Back (Erector Spinae)", x: 28, y: 40 },
    { id: "Left Gluteus Maximus", x: 23, y: 50 },
    { id: "Right Gluteus Maximus", x: 34, y: 50 },
    { id: "Left Hamstring", x: 23, y: 65 },
    { id: "Right Hamstring", x: 34, y: 65 },
    { id: "Left Gastrocnemius (Calf)", x: 22, y: 82 },
    { id: "Right Gastrocnemius (Calf)", x: 35, y: 82 },
    { id: "Left Achilles Tendon", x: 22, y: 92 },
    { id: "Right Achilles Tendon", x: 35, y: 92 },

    // --- Anterior (Front view) - Right side of image ---
    { id: "Neck (Cervical Spine)", x: 73, y: 10 },
    { id: "Right Pectoralis Major", x: 65, y: 25 },
    { id: "Left Pectoralis Major", x: 81, y: 25 },
    { id: "Right Internal Oblique", x: 65, y: 38 },
    { id: "Left Internal Oblique", x: 81, y: 38 },
    { id: "Right Rectus Femoris (Quad)", x: 65, y: 60 },
    { id: "Left Rectus Femoris (Quad)", x: 81, y: 60 },
    { id: "Right Vastus Medialis (Inner Quad)", x: 69, y: 68 },
    { id: "Left Vastus Medialis (Inner Quad)", x: 77, y: 68 },
    { id: "Right Vastus Lateralis (Outer Quad)", x: 62, y: 62 },
    { id: "Left Vastus Lateralis (Outer Quad)", x: 84, y: 62 },
    { id: "Right Patellar Tendon", x: 66, y: 73 },
    { id: "Left Patellar Tendon", x: 80, y: 73 },
    { id: "Right Tibialis Anterior (Shin)", x: 66, y: 82 },
    { id: "Left Tibialis Anterior (Shin)", x: 80, y: 82 },
];

export function AnatomyMap({
    onPartClick,
    selectedParts,
}: {
    onPartClick: (partId: string) => void;
    selectedParts: string[];
}) {
    return (
        <div className={styles.container}>
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
                                        src="/anatomy-map.jpg"
                                        alt="Muscular System Anatomy Map"
                                        className={styles.baseImage}
                                        onError={(e) => {
                                            // Provide a solid visual fallback if the image hasn't been uploaded yet by the user
                                            (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/e/e5/Muscles_anterior_labeled.png";
                                        }}
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
