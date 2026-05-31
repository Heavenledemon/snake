import { Fragment, JSX, useRef, useEffect } from 'react';
import { Coordinate } from '../types/types';
import { Animated, View } from 'react-native';

interface SnakeProps {
    snake: Coordinate[];
}

const STEP     = 10;
const BODY_SIZE = 26;
const HEAD_SIZE = 42;   // larger head so dragon features have room
const ANIM_MS   = 44;

// ─── Dragon color theme ────────────────────────────────────────────────────
const D = {
    // Body
    bodyA:      '#C62828',   // dark red primary bead
    bodyB:      '#8E0000',   // even darker alternate bead
    outline:    '#4A0000',   // deep crimson border

    // Head
    headBase:   '#B71C1C',   // deep dragon-red
    headDark:   '#7F0000',   // shadowed areas
    headShine:  'rgba(255, 160, 80, 0.28)',  // warm golden shine

    // Scales on head
    scaleArc:   'rgba(0,0,0,0.20)',

    // Brow ridge
    brow:       '#7B1F00',

    // Eyes — dragon slit eyes
    irisColor:  '#FFB300',   // molten amber iris
    pupilColor: '#0A0005',   // near-black vertical slit
    eyeGlint:   '#FFF9C4',   // pale yellow glint

    // Horns
    hornBase:   '#3E2723',   // very dark brown
    hornTip:    '#1C0A00',

    // Nostrils
    nostril:    '#5D0000',   // dark nostril hole

    // Tongue
    tongue:     '#FF1744',   // fire red
    tongueDark: '#B71C1C',
};

// ─── Dragon Head ───────────────────────────────────────────────────────────
function DragonHead({ size }: { size: number }) {
    const half   = size / 2;
    const eyeR   = 7;     // eye outer radius
    const pupilW = 3.5;   // slit width
    const pupilH = 10;    // slit height

    return (
        <>
            {/* ═══ HORNS — above the circle (CSS triangle trick) ═══ */}
            {/* Left horn */}
            <View style={{
                position: 'absolute',
                top: -14,
                left: size * 0.22,
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderLeftWidth: 6,
                borderRightWidth: 6,
                borderBottomWidth: 16,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: D.hornBase,
            }} />
            {/* Left horn inner shading */}
            <View style={{
                position: 'absolute',
                top: -10,
                left: size * 0.22 + 3,
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderLeftWidth: 3,
                borderRightWidth: 3,
                borderBottomWidth: 10,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: D.hornTip,
            }} />

            {/* Right horn */}
            <View style={{
                position: 'absolute',
                top: -14,
                right: size * 0.22,
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderLeftWidth: 6,
                borderRightWidth: 6,
                borderBottomWidth: 16,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: D.hornBase,
            }} />
            {/* Right horn inner shading */}
            <View style={{
                position: 'absolute',
                top: -10,
                right: size * 0.22 + 3,
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderLeftWidth: 3,
                borderRightWidth: 3,
                borderBottomWidth: 10,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: D.hornTip,
            }} />

            {/* ═══ FORKED TONGUE — below the circle ═══ */}
            <View style={{
                position: 'absolute',
                top: size - 1,
                left: half - 4,
                alignItems: 'center',
            }}>
                {/* Tongue base / stem */}
                <View style={{
                    width: 7,
                    height: 9,
                    backgroundColor: D.tongue,
                    borderBottomLeftRadius: 3,
                    borderBottomRightRadius: 3,
                    shadowColor: D.tongue,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.7,
                    shadowRadius: 3,
                    elevation: 2,
                }} />
                {/* Fork tips */}
                <View style={{ flexDirection: 'row', gap: 3, marginTop: -1 }}>
                    <View style={{
                        width: 3,
                        height: 7,
                        backgroundColor: D.tongue,
                        borderRadius: 2,
                        transform: [{ rotate: '-22deg' }],
                    }} />
                    <View style={{
                        width: 3,
                        height: 7,
                        backgroundColor: D.tongue,
                        borderRadius: 2,
                        transform: [{ rotate: '22deg' }],
                    }} />
                </View>
            </View>

            {/* ═══ HEAD CIRCLE — clips all face details ═══ */}
            <View style={{
                position: 'absolute',
                top: 0, left: 0,
                width: size, height: size,
                borderRadius: half,
                backgroundColor: D.headBase,
                borderWidth: 1.5,
                borderColor: D.outline,
                overflow: 'hidden',  // clips face details to circle shape
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.6,
                shadowRadius: 4,
                elevation: 14,
            }}>

                {/* Scale arc texture — top */}
                <View style={{
                    position: 'absolute',
                    top: size * 0.03,
                    left: size * 0.08,
                    width: size * 0.84,
                    height: size * 0.40,
                    borderRadius: size * 0.20,
                    borderWidth: 2,
                    borderColor: D.scaleArc,
                }} />
                {/* Scale arc texture — mid */}
                <View style={{
                    position: 'absolute',
                    top: size * 0.18,
                    left: size * 0.05,
                    width: size * 0.90,
                    height: size * 0.50,
                    borderRadius: size * 0.25,
                    borderWidth: 1.5,
                    borderColor: D.scaleArc,
                }} />

                {/* ── Brow ridge LEFT (angled dark bar) ── */}
                <View style={{
                    position: 'absolute',
                    top: size * 0.20,
                    left: size * 0.07,
                    width: size * 0.30,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: D.brow,
                    transform: [{ rotate: '-14deg' }],
                }} />
                {/* ── Brow ridge RIGHT ── */}
                <View style={{
                    position: 'absolute',
                    top: size * 0.20,
                    right: size * 0.07,
                    width: size * 0.30,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: D.brow,
                    transform: [{ rotate: '14deg' }],
                }} />

                {/* ═══ LEFT EYE ═══ */}
                {/* Glow ring */}
                <View style={{
                    position: 'absolute',
                    top: size * 0.29,
                    left: size * 0.07,
                    width: eyeR * 2 + 4,
                    height: eyeR * 2 + 4,
                    borderRadius: eyeR + 2,
                    backgroundColor: 'rgba(255,180,0,0.35)',
                }} />
                {/* Amber iris */}
                <View style={{
                    position: 'absolute',
                    top: size * 0.31,
                    left: size * 0.09,
                    width: eyeR * 2,
                    height: eyeR * 2,
                    borderRadius: eyeR,
                    backgroundColor: D.irisColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {/* Vertical slit pupil */}
                    <View style={{
                        width: pupilW,
                        height: pupilH,
                        borderRadius: pupilW / 2,
                        backgroundColor: D.pupilColor,
                    }} />
                    {/* Eye glint */}
                    <View style={{
                        position: 'absolute',
                        top: 1.5,
                        left: 2,
                        width: 3,
                        height: 3,
                        borderRadius: 1.5,
                        backgroundColor: D.eyeGlint,
                    }} />
                </View>

                {/* ═══ RIGHT EYE ═══ */}
                {/* Glow ring */}
                <View style={{
                    position: 'absolute',
                    top: size * 0.29,
                    right: size * 0.07,
                    width: eyeR * 2 + 4,
                    height: eyeR * 2 + 4,
                    borderRadius: eyeR + 2,
                    backgroundColor: 'rgba(255,180,0,0.35)',
                }} />
                {/* Amber iris */}
                <View style={{
                    position: 'absolute',
                    top: size * 0.31,
                    right: size * 0.09,
                    width: eyeR * 2,
                    height: eyeR * 2,
                    borderRadius: eyeR,
                    backgroundColor: D.irisColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {/* Vertical slit pupil */}
                    <View style={{
                        width: pupilW,
                        height: pupilH,
                        borderRadius: pupilW / 2,
                        backgroundColor: D.pupilColor,
                    }} />
                    {/* Eye glint */}
                    <View style={{
                        position: 'absolute',
                        top: 1.5,
                        left: 2,
                        width: 3,
                        height: 3,
                        borderRadius: 1.5,
                        backgroundColor: D.eyeGlint,
                    }} />
                </View>

                {/* ═══ NOSTRILS ═══ */}
                <View style={{
                    position: 'absolute',
                    top: size * 0.60,
                    left: size * 0.32,
                    width: 5,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: D.nostril,
                }} />
                <View style={{
                    position: 'absolute',
                    top: size * 0.60,
                    right: size * 0.32,
                    width: 5,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: D.nostril,
                }} />

                {/* ═══ HEAD SHINE ═══ */}
                <View style={{
                    position: 'absolute',
                    top: size * 0.07,
                    left: size * 0.16,
                    width: size * 0.38,
                    height: size * 0.28,
                    borderRadius: size * 0.14,
                    backgroundColor: D.headShine,
                }} />
            </View>
        </>
    );
}

// ─── Animated value pool ───────────────────────────────────────────────────
type AnimXY = { x: Animated.Value; y: Animated.Value };

export default function Snake({ snake }: SnakeProps): JSX.Element {
    const animRefs  = useRef<AnimXY[]>([]);
    const prevLenRef = useRef(0);

    // Lazily grow the animated-value pool
    for (let i = animRefs.current.length; i < snake.length; i++) {
        const seg  = snake[i] ?? snake[0];
        const size = i === 0 ? HEAD_SIZE : BODY_SIZE;
        animRefs.current.push({
            x: new Animated.Value(seg.x * STEP - size / 2),
            y: new Animated.Value(seg.y * STEP - size / 2),
        });
    }

    useEffect(() => {
        const isReset = snake.length === 1 && prevLenRef.current > 1;

        if (isReset) {
            animRefs.current.forEach((av, i) => {
                const size = i === 0 ? HEAD_SIZE : BODY_SIZE;
                av.x.setValue(snake[0].x * STEP - size / 2);
                av.y.setValue(snake[0].y * STEP - size / 2);
            });
        }

        const anims = snake.map((seg, i) => {
            const size = i === 0 ? HEAD_SIZE : BODY_SIZE;
            const av   = animRefs.current[i];
            return Animated.parallel([
                Animated.timing(av.x, {
                    toValue:  seg.x * STEP - size / 2,
                    duration: ANIM_MS,
                    useNativeDriver: true,
                }),
                Animated.timing(av.y, {
                    toValue:  seg.y * STEP - size / 2,
                    duration: ANIM_MS,
                    useNativeDriver: true,
                }),
            ]);
        });

        Animated.parallel(anims).start();
        prevLenRef.current = snake.length;
    }, [snake]);

    const total = snake.length;

    return (
        <Fragment>
            {/* Render tail → head so the head always sits on top */}
            {Array.from({ length: total }, (_, i) => total - 1 - i).map((index) => {
                const av     = animRefs.current[index];
                if (!av) return null;

                const isHead  = index === 0;
                const size    = isHead ? HEAD_SIZE : BODY_SIZE;
                const half    = size / 2;
                const bgColor = index % 2 === 0 ? D.bodyA : D.bodyB;

                return (
                    <Animated.View
                        key={index}
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width:  size,
                            height: size,
                            // overflow VISIBLE on outer container so horns
                            // and tongue can render outside the circle boundary
                            overflow: 'visible',
                            transform: [
                                { translateX: av.x },
                                { translateY: av.y },
                            ],
                        }}
                    >
                        {isHead ? (
                            <DragonHead size={size} />
                        ) : (
                            /* ── Body bead ── */
                            <View style={{
                                width:  size,
                                height: size,
                                borderRadius: half,
                                backgroundColor: bgColor,
                                borderWidth: 1.5,
                                borderColor: D.outline,
                                overflow: 'hidden',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.5,
                                shadowRadius: 3,
                                elevation: 6,
                            }}>
                                {/* Warm golden shine */}
                                <View style={{
                                    position: 'absolute',
                                    top:  size * 0.10,
                                    left: size * 0.14,
                                    width:  size * 0.40,
                                    height: size * 0.30,
                                    borderRadius: size * 0.15,
                                    backgroundColor: 'rgba(255,160,80,0.40)',
                                }} />
                                {/* Micro bottom glint */}
                                <View style={{
                                    position: 'absolute',
                                    bottom: size * 0.12,
                                    right:  size * 0.14,
                                    width:  size * 0.18,
                                    height: size * 0.14,
                                    borderRadius: size * 0.07,
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                }} />
                            </View>
                        )}
                    </Animated.View>
                );
            })}
        </Fragment>
    );
}