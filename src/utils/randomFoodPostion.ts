import { FoodItem } from "../types/types";

interface Bounds {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
}

// Food catalogue — emoji, how many points it's worth, glow colour
const FOOD_CATALOGUE = [
    { emoji: '🍎', points: 10,  glowColor: 'rgba(255, 45,  80,  0.7)' },
    { emoji: '🍊', points: 10,  glowColor: 'rgba(255, 140,  0,  0.7)' },
    { emoji: '🍋', points: 10,  glowColor: 'rgba(255, 230,  0,  0.7)' },
    { emoji: '🍇', points: 15,  glowColor: 'rgba(160,  32, 240, 0.7)' },
    { emoji: '🍓', points: 15,  glowColor: 'rgba(255,  60, 100, 0.7)' },
    { emoji: '🍌', points: 10,  glowColor: 'rgba(255, 220,  50, 0.7)' },
    { emoji: '🍉', points: 20,  glowColor: 'rgba( 60, 220,  60, 0.7)' },
    { emoji: '🫐', points: 20,  glowColor: 'rgba( 80, 100, 255, 0.7)' },
    { emoji: '🥝', points: 15,  glowColor: 'rgba( 90, 200,  80, 0.7)' },
    { emoji: '🍒', points: 25,  glowColor: 'rgba(200,  20,  60, 0.7)' },
    { emoji: '🥭', points: 25,  glowColor: 'rgba(255, 160,  20, 0.7)' },
    { emoji: '🍍', points: 30,  glowColor: 'rgba(220, 200,   0, 0.7)' },
];

let _nextId = 1;

/**
 * Generates a FoodItem at a random position strictly within bounds,
 * with a random food type from the catalogue.
 */
export const randomFoodPosition = (bounds: Bounds): FoodItem => {
    const xMin = bounds.xMin + 1;
    const xMax = bounds.xMax - 1;
    const yMin = bounds.yMin + 1;
    const yMax = bounds.yMax - 1;

    const x = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
    const y = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;

    const specialChance = Math.random(); // 15% overall chance to spawn a special item

    if (specialChance < 0.15) {
        if (specialChance < 0.05) {
            return {
                id: _nextId++,
                x,
                y,
                emoji:     '🌟',
                points:    50,
                glowColor: 'rgba(255, 215, 0, 0.95)',
                isGolden:  true,
            };
        } else if (specialChance < 0.09) {
            return {
                id: _nextId++,
                x,
                y,
                emoji:     '🕒',
                points:    25,
                glowColor: 'rgba(0, 255, 255, 0.95)',
                powerUpType: 'warp',
            };
        } else if (specialChance < 0.12) {
            return {
                id: _nextId++,
                x,
                y,
                emoji:     '🧲',
                points:    25,
                glowColor: 'rgba(255, 165, 0, 0.95)',
                powerUpType: 'magnet',
            };
        } else {
            return {
                id: _nextId++,
                x,
                y,
                emoji:     '🛡️',
                points:    25,
                glowColor: 'rgba(255, 255, 255, 0.95)',
                powerUpType: 'shield',
            };
        }
    }

    const type = FOOD_CATALOGUE[Math.floor(Math.random() * FOOD_CATALOGUE.length)];

    return {
        id: _nextId++,
        x,
        y,
        emoji:     type.emoji,
        points:    type.points,
        glowColor: type.glowColor,
    };
};

/** Generates N non-overlapping food items within bounds. */
export const generateFoodItems = (bounds: Bounds, count: number): FoodItem[] => {
    const items: FoodItem[] = [];
    const occupied = new Set<string>();

    let attempts = 0;
    while (items.length < count && attempts < count * 20) {
        attempts++;
        const item = randomFoodPosition(bounds);
        const key = `${item.x},${item.y}`;
        if (!occupied.has(key)) {
            occupied.add(key);
            items.push(item);
        }
    }
    return items;
};