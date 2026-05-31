import {Coordinate, Obstacle} from "../types/types";

export const checkGameOver = (
    snakeHead: Coordinate, 
    boundaries: any, 
    obstacles: Obstacle[] = []
): boolean => {
    // Wall collision
    const hitWall = (
        snakeHead.x < boundaries.xMin ||
        snakeHead.x > boundaries.xMax ||
        snakeHead.y < boundaries.yMin ||
        snakeHead.y > boundaries.yMax
    );

    if (hitWall) return true;

    // Obstacle collision (Maze elements)
    const hitObstacle = obstacles.some(obs => {
        return (
            snakeHead.x >= obs.x &&
            snakeHead.x <= obs.x + obs.width &&
            snakeHead.y >= obs.y &&
            snakeHead.y <= obs.y + obs.height
        );
    });

    return hitObstacle;
}