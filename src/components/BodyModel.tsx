"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useState } from "react";

type Vector3Tuple = [number, number, number];

const bodyPartsList = [
    { id: "Head", position: [0, 3.5, 0] as Vector3Tuple, scale: [0.8, 1, 0.8] as Vector3Tuple },
    { id: "Neck", position: [0, 2.7, 0] as Vector3Tuple, scale: [0.4, 0.6, 0.4] as Vector3Tuple },
    { id: "Torso", position: [0, 1, 0] as Vector3Tuple, scale: [1.5, 2.5, 0.8] as Vector3Tuple },
    { id: "LeftArm", position: [-1.2, 1.5, 0] as Vector3Tuple, scale: [0.4, 2, 0.4] as Vector3Tuple },
    { id: "RightArm", position: [1.2, 1.5, 0] as Vector3Tuple, scale: [0.4, 2, 0.4] as Vector3Tuple },
    { id: "LeftLeg", position: [-0.6, -1.5, 0] as Vector3Tuple, scale: [0.5, 2.5, 0.5] as Vector3Tuple },
    { id: "RightLeg", position: [0.6, -1.5, 0] as Vector3Tuple, scale: [0.5, 2.5, 0.5] as Vector3Tuple },
    { id: "LeftKnee", position: [-0.6, -2.8, 0] as Vector3Tuple, scale: [0.55, 0.55, 0.55] as Vector3Tuple },
    { id: "RightKnee", position: [0.6, -2.8, 0] as Vector3Tuple, scale: [0.55, 0.55, 0.55] as Vector3Tuple },
    { id: "LowerBack", position: [0, -0.3, -0.4] as Vector3Tuple, scale: [1.2, 0.8, 0.5] as Vector3Tuple },
    { id: "Shoulders", position: [0, 2.2, -0.2] as Vector3Tuple, scale: [1.6, 0.6, 0.6] as Vector3Tuple }
];

export function BodyModel({
    onPartClick,
    selectedParts,
}: {
    onPartClick: (partId: string) => void;
    selectedParts: string[];
}) {
    return (
        <div style={{ width: "100%", height: "60vh", background: "var(--surface)", borderRadius: "1rem", border: "1px solid var(--surface-border)", overflow: "hidden" }}>
            <Canvas camera={{ position: [0, 1, 8], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <directionalLight position={[-10, 10, -5]} intensity={0.5} />

                <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />

                {bodyPartsList.map((part) => {
                    const isSelected = selectedParts.includes(part.id);
                    const [hovered, setHover] = useState(false);

                    return (
                        <mesh
                            key={part.id}
                            position={part.position}
                            scale={part.scale}
                            onClick={(e) => {
                                e.stopPropagation();
                                onPartClick(part.id);
                            }}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                setHover(true);
                            }}
                            onPointerOut={(e) => {
                                e.stopPropagation();
                                setHover(false);
                            }}
                        >
                            <boxGeometry args={[1, 1, 1]} />
                            <meshStandardMaterial
                                color={isSelected ? "#ef4444" : hovered ? "#3b82f6" : "#e5e7eb"}
                                roughness={0.4}
                                metalness={0.1}
                            />
                            {isSelected && (
                                <Html position={[0, 1.2, 0]} center>
                                    <div style={{ background: "#ef4444", color: "white", padding: "2px 6px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                                        Selected
                                    </div>
                                </Html>
                            )}
                        </mesh>
                    );
                })}
            </Canvas>
        </div>
    );
}
