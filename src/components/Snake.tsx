import { Fragment, JSX } from 'react';
import { Coordinate } from '../types/types';
import { View } from 'react-native';
import { Colors } from '../styles/colors';

interface SnakeProps {
    snake: Coordinate[];
    isGhostMode?: boolean;
    score?: number;
    comboActive?: boolean;
}

const STEP = 10;
const BODY_SIZE = 26;
const HEAD_SIZE = 34;   // sleek, cute glowing head

// Cute Glowing Neon Head
function NeonHead({ size, comboActive }: { size: number; comboActive?: boolean }) {
    const half = size / 2;

    return (
        <View style={{
            width: size,
            height: size,
            borderRadius: half,
            backgroundColor: Colors.surface,  // dark core

            borderWidth: 2.5,
            borderColor: '#39FF14',    // neon green outer boundary
            shadowColor: '#39FF14',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 12,
            elevation: 14,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        }}>
            {/* 🔥 COMBO Fire Aura Effect */}
            {comboActive && (
                <View style={{
                    position: 'absolute',
                    width: size * 1.5,
                    height: size * 1.5,
                    borderRadius: (size * 1.5) / 2,
                    backgroundColor: 'rgba(255, 69, 0, 0.25)',
                    shadowColor: '#FF4500',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 1,
                    shadowRadius: 18,
                    elevation: 16,
                    zIndex: -2,
                }} />
            )}

            {/* ═══ BIG CUTE EYES ═══ */}
            <View style={{
                flexDirection: 'row',
                gap: 2,
                marginTop: -size * 0.08,
            }}>
                <View style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1.2,
                    borderColor: '#111111',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        width: 4.5,
                        height: 4.5,
                        borderRadius: 2.25,
                        backgroundColor: Colors.electricMagenta,
                    }} />
                </View>

                <View style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#FFFFFF',
                    borderWidth: 1.2,
                    borderColor: '#111111',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        width: 4.5,
                        height: 4.5,
                        borderRadius: 2.25,
                        backgroundColor: Colors.electricMagenta,
                    }} />
                </View>
            </View>

            {/* ═══ NOSTRILS ═══ */}
            <View style={{
                position: 'absolute',
                bottom: size * 0.16,
                flexDirection: 'row',
                gap: 2.5,
            }}>
                <View style={{
                    width: 3.5,
                    height: 3.5,
                    borderRadius: 1.75,
                    backgroundColor: Colors.electricMagenta,
                }} />
                <View style={{
                    width: 3.5,
                    height: 3.5,
                    borderRadius: 1.75,
                    backgroundColor: Colors.electricMagenta,
                }} />
            </View>
        </View>
    );
}

export default function Snake({ snake, isGhostMode, score = 0, comboActive = false }: SnakeProps): JSX.Element {
    const total = snake.length;

    // Dynamic Thickness Size Scaling as the snake grows
    const lengthScale = 1 + Math.min(total * 0.005, 0.25);
    const currentBodySize = BODY_SIZE * lengthScale;
    const currentHeadSize = HEAD_SIZE * lengthScale;

    // Skin Selector configurations based on Score Tiers
    const getSkinConfig = (index: number) => {
        if (score >= 1000) {
            // Cosmic Dark-matter Skin
            const hue = (index * 25) % 360;
            return {
                coreColor: '#07070E',
                borderColor: `hsl(${hue}, 100%, 65%)`,
                shadowColor: `hsl(${hue}, 100%, 55%)`,
            };
        } else if (score >= 500) {
            // Electric Hot Pink Pulsing Skin
            return {
                coreColor: '#FFFFFF',
                borderColor: '#FF007F',
                shadowColor: '#FF007F',
            };
        } else if (score >= 100) {
            // Cyber Gold Skin
            return {
                coreColor: '#FFD700',
                borderColor: '#FF8C00',
                shadowColor: '#FFD700',
            };
        } else {
            // Standard Rainbow Neon Skin
            const hue = (index * 15) % 360;
            return {
                coreColor: '#FFFFFF',
                borderColor: `hsl(${hue}, 100%, 60%)`,
                shadowColor: `hsl(${hue}, 100%, 60%)`,
            };
        }
    };

    return (
        <Fragment>
            {/* Render tail to head so the head sits on top */}
            {Array.from({ length: total }, (_, i) => total - 1 - i).map((index) => {
                const seg = snake[index];
                if (!seg) return null;

                const isHead = index === 0;
                const size = isHead ? currentHeadSize : currentBodySize;
                const half = size / 2;

                const skin = getSkinConfig(index);

                return (
                    <View
                        key={index}
                        style={{
                            position: 'absolute',
                            left: seg.x * STEP - size / 2,
                            top: seg.y * STEP - size / 2,
                            width: size,
                            height: size,
                            overflow: 'visible',
                            opacity: isGhostMode ? 0.58 : 1, // beautiful spectral ghost mode
                        }}
                    >
                        {isHead ? (
                            <NeonHead size={size} comboActive={comboActive} />
                        ) : (
                            /* ── Glowing Neon Core Body Bead ── */
                            <View style={{
                                width: size,
                                height: size,
                                borderRadius: half,
                                backgroundColor: skin.coreColor, // Core color based on tier skin
                                borderWidth: 2,
                                borderColor: skin.borderColor,     // Outline color
                                shadowColor: skin.shadowColor,
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 1,
                                shadowRadius: 8,
                                elevation: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {/* Glossy high-reflectance neon capsule accent */}
                                <View style={{
                                    position: 'absolute',
                                    top: size * 0.12,
                                    left: size * 0.15,
                                    width: size * 0.35,
                                    height: size * 0.22,
                                    borderRadius: size * 0.11,
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                }} />
                                {/* Inner micro neon accent ring */}
                                <View style={{
                                    width: size * 0.6,
                                    height: size * 0.6,
                                    borderRadius: (size * 0.6) / 2,
                                    borderWidth: 1,
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                }} />
                            </View>
                        )}
                    </View>
                );
            })}
        </Fragment>
    );
}