"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useState } from "react";

type Vector3Tuple = [number, number, number];

// Anatomical Points specifically requested, mapped to 3D space.
const painNodes = [
    { id: "Left Trapezius", position: [-0.6, 2.7, -0.3] as Vector3Tuple },
    { id: "Right Trapezius", position: [0.6, 2.7, -0.3] as Vector3Tuple },
    { id: "Left Pectoralis Major", position: [-0.5, 2.0, 0.4] as Vector3Tuple },
    { id: "Right Pectoralis Major", position: [0.5, 2.0, 0.4] as Vector3Tuple },
    { id: "Left Internal Oblique", position: [-0.6, 0.8, 0.4] as Vector3Tuple },
    { id: "Right Internal Oblique", position: [0.6, 0.8, 0.4] as Vector3Tuple },
    { id: "Lower Back (Erector Spinae)", position: [0, 0.8, -0.5] as Vector3Tuple },
    { id: "Left Gluteus Maximus", position: [-0.5, -0.2, -0.5] as Vector3Tuple },
    { id: "Right Gluteus Maximus", position: [0.5, -0.2, -0.5] as Vector3Tuple },
    { id: "Left Rectus Femoris (Quad)", position: [-0.6, -1.2, 0.3] as Vector3Tuple },
    { id: "Right Rectus Femoris (Quad)", position: [0.6, -1.2, 0.3] as Vector3Tuple },
    { id: "Left Vastus Medialis", position: [-0.3, -1.8, 0.3] as Vector3Tuple },
    { id: "Right Vastus Medialis", position: [0.3, -1.8, 0.3] as Vector3Tuple },
    { id: "Left Vastus Lateralis", position: [-0.9, -1.5, 0.2] as Vector3Tuple },
    { id: "Right Vastus Lateralis", position: [0.9, -1.5, 0.2] as Vector3Tuple },
    { id: "Left Hamstring", position: [-0.6, -1.5, -0.3] as Vector3Tuple },
    { id: "Right Hamstring", position: [0.6, -1.5, -0.3] as Vector3Tuple },
    { id: "Left Patellar Tendon", position: [-0.6, -2.6, 0.3] as Vector3Tuple },
    { id: "Right Patellar Tendon", position: [0.6, -2.6, 0.3] as Vector3Tuple },
    { id: "Left Gastrocnemius (Calf)", position: [-0.6, -3.5, -0.2] as Vector3Tuple },
    { id: "Right Gastrocnemius (Calf)", position: [0.6, -3.5, -0.2] as Vector3Tuple },
    { id: "Left Achilles Tendon", position: [-0.6, -4.2, -0.2] as Vector3Tuple },
    { id: "Right Achilles Tendon", position: [0.6, -4.2, -0.2] as Vector3Tuple },
    { id: "Left Tibialis Anterior", position: [-0.6, -3.5, 0.2] as Vector3Tuple },
    { id: "Right Tibialis Anterior", position: [0.6, -3.5, 0.2] as Vector3Tuple },
    { id: "Left Triceps Brachii", position: [-1.4, 1.6, -0.2] as Vector3Tuple },
    { id: "Right Triceps Brachii", position: [1.4, 1.6, -0.2] as Vector3Tuple },
    { id: "Left Biceps Brachii", position: [-1.4, 1.6, 0.2] as Vector3Tuple },
    { id: "Right Biceps Brachii", position: [1.4, 1.6, 0.2] as Vector3Tuple },
    { id: "Hands/Wrists", position: [0, -0.5, 1.2] as Vector3Tuple }, // simplified
    { id: "Neck (Cervical Spine)", position: [0, 3.0, -0.2] as Vector3Tuple },
];

function ModelFrame() {
    // A simplified visual representation of the human body (Gray & slightly transparent)
    return (
        <group>
            {/* Head */}
            <mesh position={[0, 3.6, 0]}>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshStandardMaterial color="#888" opacity={0.3} transparent />
            </mesh>
            {/* Torso */}
            <mesh position={[0, 1.4, 0]}>
                <capsuleGeometry args={[0.8, 2.0, 4, 16]} />
                <meshStandardMaterial color="#888" opacity={0.3} transparent />
            </mesh>
            {/* Pelvis/Hips */}
            <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                <capsuleGeometry args={[0.8, 0.6, 4, 16]} />
                <meshStandardMaterial color="#888" opacity={0.3} transparent />
            </mesh>
            {/* Left Leg */}
            <mesh position={[-0.6, -1.6, 0]}>
                <capsuleGeometry args={[0.3, 1.8, 4, 16]} />
                <meshStandardMaterial color="#888" opacity={0.3} transparent />
            </mesh>
            {/* Right Leg */}
            <mesh position={[0.6, -1.6, 0]}>
                <capsuleGeometry args={[0.3, 1.8, 4, 16]} />
                <meshStandardMaterial color="#888" opacity={0.3} transparent />
            </mesh>
            {/* Left Calf */}
            <mesh position={[-0.6, -3.5, 0]}>
                <capsuleGeometry args={[0.25, 1.4, 4, 16]} />
                <meshStandardMaterial color="#888" opacity={0.3} transparent />
            </mesh>
            {/* Right Calf */}
            <mesh position={[0.6, -3.5, 0]}>
                <capsuleGeometry args={[0.25, 1.4, 4, 16]} />
                <meshStandardMaterial color="#888" opacity={0.3} transparent />
            </mesh>
            {/* Left Arm */}
            <mesh position={[-1.4, 1.4, 0]}>
                <capsuleGeometry args={[0.25, 1.6, 4, 16]} />
                <meshStandardMaterial color="#888" opacity={0.3} transparent />
            </mesh>
            {/* Right Arm */}
            <mesh position={[1.4, 1.4, 0]}>
                <capsuleGeometry args={[0.25, 1.6, 4, 16]} />
                <meshStandardMaterial color="#888" opacity={0.3} transparent />
            </mesh>
        </group>
    );
}

export function BodyModel({
    onPartClick,
    selectedParts,
}: {
    onPartClick: (partId: string) => void;
    selectedParts: string[];
}) {
    return (
        <div style={{ width: "100%", height: "70vh", background: "var(--surface)", borderRadius: "1rem", border: "1px solid var(--surface-border)", overflow: "hidden" }}>
            <Canvas camera={{ position: [0, 1, 8], fov: 60 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <directionalLight position={[-10, 10, -5]} intensity={0.8} />

                <OrbitControls enablePan={true} maxPolarAngle={Math.PI} minPolarAngle={0} zoomSpeed={0.8} />

                <ModelFrame />

                {/* Render Pain Nodes */}
                {painNodes.map((node) => {
                    const isSelected = selectedParts.includes(node.id);
                    const [hovered, setHover] = useState(false);

                    return (
                        <mesh
                            key={node.id}
                            position={node.position}
                            onClick={(e) => {
                                e.stopPropagation();
                                onPartClick(node.id);
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
                            <sphereGeometry args={[isSelected ? 0.2 : hovered ? 0.15 : 0.1, 16, 16]} />
                            <meshStandardMaterial
                                color={isSelected ? "#ef4444" : hovered ? "#3b82f6" : "#facc15"}
                                roughness={0.3}
                                metalness={0.5}
                                emissive={isSelected ? "#ef4444" : "#000000"}
                                emissiveIntensity={0.5}
                            />

                            {(isSelected || hovered) && (
                                <Html position={[0, 0.3, 0]} center zIndexRange={[100, 0]}>
                                    <div style={{
                                        background: isSelected ? "#ef4444" : "rgba(0,0,0,0.8)",
                                        color: "white",
                                        padding: "4px 8px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        whiteSpace: "nowrap",
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                                    }}>
                                        {node.id}
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
