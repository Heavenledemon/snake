import { Obstacle } from "../types/types";

export interface Maze {
  id: number;
  title: string;
  threshold: number; // Score to unlock this maze
  obstacles: Obstacle[];
  accentColor: string;
}

export const MAZES: Maze[] = [
  {
    id: 1,
    title: "OPEN VOID",
    threshold: 0,
    obstacles: [],
    accentColor: "#00F3FF", // Cyber Cyan
  },
  {
    id: 2,
    title: "TWIN GATES",
    threshold: 150,
    obstacles: [
      { x: 12, y: 10, width: 1, height: 12 },
      { x: 32, y: 10, width: 1, height: 12 },
      { x: 12, y: 35, width: 1, height: 12 },
      { x: 32, y: 35, width: 1, height: 12 },
    ],
    accentColor: "#9D00FF", // Prism Purple
  },
  {
    id: 3,
    title: "CROSS SECTOR",
    threshold: 400,
    obstacles: [
      { x: 22, y: 5, width: 1, height: 15 },
      { x: 22, y: 35, width: 1, height: 15 },
      { x: 5, y: 27, width: 15, height: 1 },
      { x: 30, y: 27, width: 15, height: 1 },
    ],
    accentColor: "#FF0060", // Electric Magenta
  },
  {
    id: 4,
    title: "THE GRID",
    threshold: 800,
    obstacles: [
      { x: 10, y: 10, width: 6, height: 1 },
      { x: 30, y: 10, width: 6, height: 1 },
      { x: 10, y: 45, width: 6, height: 1 },
      { x: 30, y: 45, width: 6, height: 1 },
      { x: 22, y: 20, width: 1, height: 15 },
    ],
    accentColor: "#39FF14", // Neon Green
  }
];