export interface GestureEventType {
    nativeEvent:{
        translationX: number,
        translationY: number
    }
}

export interface Coordinate {
    x: number,
    y: number
}

export interface FoodItem extends Coordinate {
    id: number;
    emoji: string;
    points: number;
    glowColor: string;
    isGolden?: boolean;
}

export enum Direction {
    Right,
    Left,
    Up,
    Down
}

export interface Obstacle extends Coordinate {
    width: number;
    height: number;
}