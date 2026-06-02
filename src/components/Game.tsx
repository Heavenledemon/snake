import * as React from "react";
import { JSX, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TouchableOpacity, LayoutChangeEvent, Animated } from "react-native";
import { Colors } from "../styles/colors";
import { PanGestureHandler } from "react-native-gesture-handler";
import { FoodItem, Direction, GestureEventType } from "../types/types";
import Snake from "./Snake";
import { checkGameOver } from "../utils/checkGameOver";
import Food from "./Food";
import { checkEatsFood } from "../utils/checkEatsFood";
import { randomFoodPosition, generateFoodItems } from "../utils/randomFoodPostion";
import Header from "./Header";
import StartScreen from "./StartScreen";

import { MAZES, Maze } from "../utils/mazes";
import * as Haptics from "expo-haptics";

// Each grid cell = 10 px (must match Snake.tsx STEP constant)
const CELL_SIZE = 10;

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_COUNT = 3;   // how many food items on board at once
const MOVE_INTERVAL = 30; // 30ms intervals for high 33fps responsiveness

interface Bounds { xMin: number; xMax: number; yMin: number; yMax: number; }

export default function Game(): JSX.Element {
  const [dirVec, setDirVec] = useState<{ dx: number; dy: number }>({ dx: 1, dy: 0 });
  const [snake, setSnake] = useState<{ x: number; y: number }[]>(SNAKE_INITIAL_POSITION);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);

  // Dynamic Maze System State
  const [currentMazeIdx, setCurrentMazeIdx] = useState<number>(0);
  const currentMaze = MAZES[currentMazeIdx];
  const [showMazeShift, setShowMazeShift] = useState<boolean>(false);

  // Derived from actual board pixel size
  const [gameBounds, setGameBounds] = useState<Bounds | null>(null);
  const gameBoundsRef = useRef<Bounds | null>(null);

  // Combo & Momentum System
  const [comboActive, setComboActive] = useState<boolean>(false);
  const lastEatTimeRef = useRef<number>(0);
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Golden Food Powerup System (Ghost Mode)
  const [isGhostMode, setIsGhostMode] = useState<boolean>(false);
  const ghostTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Screen Shake & Popups
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [popups, setPopups] = useState<{ id: number; text: string; x: number; y: number; isGolden?: boolean }[]>([]);
  
  // Use refs for values accessed in game loop to avoid closure staleness
  const snakeRef = useRef(snake);
  const dirVecRef = useRef(dirVec);
  const scoreRef = useRef(score);
  const isGhostModeRef = useRef(isGhostMode);
  const foodsRef = useRef(foods);
  const currentMazeIdxRef = useRef(currentMazeIdx);

  // Sync refs with state
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { dirVecRef.current = dirVec; }, [dirVec]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { isGhostModeRef.current = isGhostMode; }, [isGhostMode]);
  useEffect(() => { foodsRef.current = foods; }, [foods]);
  useEffect(() => { currentMazeIdxRef.current = currentMazeIdx; }, [currentMazeIdx]);

  const triggerScreenShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 3, duration: 25, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -3, duration: 25, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 25, useNativeDriver: true }),
    ]).start();
  }, []);

  const onBoardLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    const bounds: Bounds = {
      xMin: 0,
      xMax: Math.floor(width / CELL_SIZE) - 1,
      yMin: 0,
      yMax: Math.floor(height / CELL_SIZE) - 1,
    };
    gameBoundsRef.current = bounds;
    setGameBounds(bounds);
    setFoods(generateFoodItems(bounds, FOOD_COUNT));
  }, []);

  const resetGame = (bounds: Bounds | null = gameBoundsRef.current) => {
    setDirVec({ dx: 1, dy: 0 });
    setSnake(SNAKE_INITIAL_POSITION);
    setFoods(bounds ? generateFoodItems(bounds, FOOD_COUNT) : []);
    setIsGameOver(false);
    setIsGhostMode(false);
    setScore(0);
    setCurrentMazeIdx(0);
    setShowMazeShift(false);
  };

  const handleStart = () => {
    resetGame();
    setGameStarted(true);
  };

  useEffect(() => {
    if (!isGameOver && gameBounds) {
      const intervalId = setInterval(() => {
        if (!isPaused && !showMazeShift) {
          moveSnake();
        }
      }, MOVE_INTERVAL);
      return () => clearInterval(intervalId);
    }
  }, [isGameOver, isPaused, gameBounds, showMazeShift]);

  const moveSnake = useCallback(() => {
    const bounds = gameBoundsRef.current;
    if (!bounds) return;

    // Use refs for latest values
    const currentSnake = snakeRef.current;
    const currentDirVec = dirVecRef.current;
    const currentScore = scoreRef.current;
    const currentIsGhostMode = isGhostModeRef.current;
    const currentFoods = foodsRef.current;
    const currentMazeIndex = currentMazeIdxRef.current;
    const currentMazeLocal = MAZES[currentMazeIndex];

    // Dynamic Speed Ramping
    const baseSpeed = 0.45;
    const SPEED = baseSpeed + Math.min(currentScore * 0.0012, 0.40);
    const spacing = 1.3;

    const snakeHead = currentSnake[0];
    const newHead = {
      x: snakeHead.x + currentDirVec.dx * SPEED,
      y: snakeHead.y + currentDirVec.dy * SPEED,
    };

    if (checkGameOver(newHead, bounds, currentMazeLocal.obstacles)) {
      if (currentIsGhostMode) {
        if (newHead.x < bounds.xMin) newHead.x = bounds.xMax;
        else if (newHead.x > bounds.xMax) newHead.x = bounds.xMin;
        if (newHead.y < bounds.yMin) newHead.y = bounds.yMax;
        else if (newHead.y > bounds.yMax) newHead.y = bounds.yMin;
      } else {
        setIsGameOver(true);
        setHighScore((prev) => Math.max(prev, currentScore));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        triggerScreenShake();
        return;
      }
    }

    const newSegments = [...currentSnake];
    newSegments[0] = newHead;

    for (let i = 1; i < newSegments.length; i++) {
      const vx = newSegments[i - 1].x - newSegments[i].x;
      const vy = newSegments[i - 1].y - newSegments[i].y;
      const dist = Math.sqrt(vx * vx + vy * vy);
      if (dist > spacing) {
        newSegments[i] = {
          x: newSegments[i - 1].x - (vx / dist) * spacing,
          y: newSegments[i - 1].y - (vy / dist) * spacing,
        };
      }
    }

    const eatenIndex = currentFoods.findIndex((f) => checkEatsFood(newHead, f, 2.5));
    if (eatenIndex !== -1) {
      const eaten = currentFoods[eatenIndex];
      const newFoods = [...currentFoods];
      newFoods[eatenIndex] = randomFoodPosition(bounds);
      setFoods(newFoods);

      const lastSeg = newSegments[newSegments.length - 1];
      const secondLast = newSegments[newSegments.length - 2] || lastSeg;
      const vx = lastSeg.x - secondLast.x;
      const vy = lastSeg.y - secondLast.y;
      const dist = Math.sqrt(vx * vx + vy * vy) || 1;
      const newTail = {
        x: lastSeg.x + (vx / dist) * spacing,
        y: lastSeg.y + (vy / dist) * spacing,
      };

      if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);

      const now = Date.now();
      const isCombo = now - lastEatTimeRef.current < 2000;
      lastEatTimeRef.current = now;

      let scoreGain = eaten.points;
      if (isCombo) {
        scoreGain *= 2;
        setComboActive(true);
        comboTimeoutRef.current = setTimeout(() => setComboActive(false), 1200);
      } else {
        setComboActive(false);
      }

      if (eaten.isGolden) {
        setIsGhostMode(true);
        if (ghostTimeoutRef.current) clearTimeout(ghostTimeoutRef.current);
        ghostTimeoutRef.current = setTimeout(() => setIsGhostMode(false), 3000);
      }

      const newPopup = {
        id: Date.now() + Math.random(),
        text: `+${scoreGain}${isCombo ? " 🔥" : ""}`,
        x: eaten.x * 10,
        y: eaten.y * 10,
        isGolden: eaten.isGolden,
      };
      setPopups((prev) => [...prev, newPopup]);
      setTimeout(() => setPopups((prev) => prev.filter((p) => p.id !== newPopup.id)), 750);

      const newScore = currentScore + scoreGain;
      setSnake([...newSegments, newTail]);
      setScore(newScore);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Dynamic Maze Shift Logic
      const nextMaze = MAZES[currentMazeIndex + 1];
      if (nextMaze && newScore >= nextMaze.threshold) {
        setCurrentMazeIdx(currentMazeIndex + 1);
        setShowMazeShift(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => setShowMazeShift(false), 1500);
      }
    } else {
      setSnake(newSegments);
    }
  }, [triggerScreenShake]);

  const handleGesture = (event: GestureEventType) => {
    const { translationX, translationY } = event.nativeEvent;
    const dist = Math.sqrt(translationX * translationX + translationY * translationY);
    if (dist > 8) {
      setDirVec({ dx: translationX / dist, dy: translationY / dist });
    }
  };

  if (!gameStarted) {
    return <StartScreen highScore={highScore} onStart={handleStart} />;
  }

  return (
    <View style={styles.container}>
      <Header
        score={score}
        isPaused={isPaused}
        onPausePress={() => setIsPaused(!isPaused)}
        onRestartPress={() => resetGame()}
        onQuitPress={() => { setGameStarted(false); resetGame(); }}
      />

      <PanGestureHandler onGestureEvent={handleGesture}>
        <SafeAreaView style={styles.gameContainer}>
          <Animated.View
            style={[
              styles.boundaries,
              {
                transform: [{ translateX: shakeAnim }, { translateY: shakeAnim }],
                borderColor: currentMaze.accentColor,
                shadowColor: currentMaze.accentColor
              }
            ]}
            onLayout={onBoardLayout}
          >
            {/* Maze Title Indicator */}
            <View style={styles.levelIndicator}>
              <Text style={[styles.levelTitleText, { color: currentMaze.accentColor + '50' }]}>
                AREA: {currentMaze.title}
              </Text>
            </View>



            <Snake snake={snake} isGhostMode={isGhostMode} />
            {foods.map((item) => <Food key={item.id} item={item} />)}

            {/* Maze Obstacles */}
            {currentMaze.obstacles.map((obs, idx) => (
              <View
                key={`${currentMaze.id}-obs-${idx}`}
                style={[
                  styles.obstacle,
                  {
                    left: obs.x * CELL_SIZE,
                    top: obs.y * CELL_SIZE,
                    width: obs.width * CELL_SIZE,
                    height: obs.height * CELL_SIZE,
                    borderColor: currentMaze.accentColor,
                    shadowColor: currentMaze.accentColor,
                  },
                ]}
              />
            ))}

            {popups.map((popup) => <FloatingPopup key={popup.id} item={popup} />)}

            {comboActive && (
              <View style={[styles.comboBadge, { backgroundColor: currentMaze.accentColor }]}>
                <Text style={styles.comboText}>🔥 COMBO 2X!</Text>
              </View>
            )}

            {isGhostMode && (
              <View style={[styles.comboBadge, { top: 60, backgroundColor: 'rgba(0, 243, 255, 0.90)', shadowColor: Colors.cyberCyan, borderColor: '#FFFFFF' }]}>
                <Text style={styles.comboText}>👻 GHOST MODE ACTIVE!</Text>
              </View>
            )}

            {showMazeShift && (
              <View style={styles.levelUpOverlay}>
                <Text style={[styles.levelUpText, { color: currentMaze.accentColor, textShadowColor: currentMaze.accentColor }]}>
                  MAZE SHIFTED
                </Text>
                <Text style={styles.levelUpTarget}>{currentMaze.title}</Text>
              </View>
            )}

            {isGameOver && (
              <View style={styles.gameOverOverlay}>
                <View style={styles.gameOverCard}>
                  <Text style={styles.gameOverEmoji}>💀</Text>
                  <Text style={styles.gameOverTitle}>GAME OVER</Text>
                  <Text style={styles.gameOverScore}>Score: {score}</Text>
                  <TouchableOpacity style={styles.restartButton} onPress={() => resetGame()}>
                    <Text style={styles.restartButtonText}>↩ PLAY AGAIN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.restartButton, { marginTop: 10, borderColor: Colors.cyberCyan, shadowColor: Colors.cyberCyan }]}
                    onPress={() => { setGameStarted(false); resetGame(); }}
                  >
                    <Text style={[styles.restartButtonText, { color: Colors.cyberCyan }]}>⌂  MAIN MENU</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>
        </SafeAreaView>
      </PanGestureHandler>
    </View>
  );
}


function FloatingPopup({ item }: { item: { text: string; x: number; y: number; isGolden?: boolean } }) {
  const yAnim = useRef(new Animated.Value(item.y - 10)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(yAnim, { toValue: item.y - 45, duration: 700, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.Text
      style={{
        position: "absolute",
        left: item.x,
        transform: [{ translateY: yAnim }],
        opacity: opacityAnim,
        color: item.isGolden ? "#FFD700" : Colors.neonGreen,
        fontWeight: "900",
        fontSize: item.isGolden ? 18 : 14,
        shadowColor: item.isGolden ? "#FFD700" : Colors.neonGreen,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        zIndex: 90,
      }}
    >
      {item.text}
    </Animated.Text>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gameContainer: {
    flex: 1,
    margin: 12,
    position: 'relative',
  },

  boundaries: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 8,
    backgroundColor: Colors.boardBg,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },

  levelIndicator: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 40,
  },
  levelTitleText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },

  levelUpOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  levelUpText: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 6,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  levelUpTarget: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 4,
    marginTop: 4,
  },

  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 2, 5, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  gameOverCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 40,
    paddingHorizontal: 40,
    width: '85%',
    shadowColor: Colors.electricMagenta,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
  },
  gameOverEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.electricMagenta,
    letterSpacing: 8,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: Colors.electricMagentaGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  gameOverScore: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 32,
    letterSpacing: 2,
    fontWeight: '600',
  },
  restartButton: {
    backgroundColor: Colors.cyberCyan + '15',
    borderWidth: 1,
    borderColor: Colors.cyberCyan,
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.cyberCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  restartButtonText: {
    color: Colors.cyberCyan,
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 4,
  },
  comboBadge: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 12,
    zIndex: 50,
  },
  comboText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 3,
  },
  obstacle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
});