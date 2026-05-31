import * as React from "react";
import { JSX, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { Colors } from "../styles/colors";
import { Gesture, PanGestureHandler } from "react-native-gesture-handler";
import { Coordinate, Direction, GestureEventType } from "../types/types";
import Snake from "./Snake";
import { checkGameOver } from "../utils/checkGameOver";
import Food from "./Food";
import { checkEatsFood } from "../utils/checkEatsFood";
import { randomFoodPosition } from "../utils/randomFoodPostion";
import Header from "./Header";

const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const GAME_BOUNDS = { xMin: 0, xMax: 35, yMin: 0, yMax: 75 };
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;

export default function Game(): JSX.Element {
  const [direction, setDirection] = useState<Direction>(Direction.Right);

  const [snake, setSnake] = useState<Coordinate[]>(SNAKE_INITIAL_POSITION);

  const [food, setFood] = useState<Coordinate>(FOOD_INITIAL_POSITION);

  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const [isPaused, setIsPaused] = useState<boolean>(false);

  const [score, setScore] = useState<number>(0);

  const resetGame = () => {
    setDirection(Direction.Right);
    setSnake(SNAKE_INITIAL_POSITION);
    setFood(FOOD_INITIAL_POSITION);
    setIsGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    if(!isGameOver){
      const intervalId = setInterval(() => {
       !isPaused && moveSnake();
    },MOVE_INTERVAL)
    return () => clearInterval(intervalId); 
  }
  },[snake, isGameOver, isPaused]);

  const moveSnake = () => {
     const snakeHead = snake[0];
     const newHead = { ...snakeHead };// craeting a copy

     if(checkGameOver(snakeHead, GAME_BOUNDS)){
      setIsGameOver((prev) => !prev);
      return;
     }
     switch (direction) { 
      case Direction.Up:
        newHead.y -= 1;
        break;
      case Direction.Down:
        newHead.y += 1;
        break;
      case Direction.Left:
        newHead.x -= 1;
        break;
      case Direction.Right:
        newHead.x += 1;
        break;
      default:
        break;
     }

     //if eats food
     //grow snake and generate new food
     if (checkEatsFood(newHead, food,2)){
      setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
      setSnake([newHead, ...snake]);
      
      setScore((prev) => prev + SCORE_INCREMENT);
     }else{
      setSnake([newHead, ...snake.slice(0,-1)]);
     }
     
  };

  const handleGesture = (event: GestureEventType) => {
    const { translationX, translationY } = event.nativeEvent;

    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        setDirection(Direction.Right);
      } else {
        setDirection(Direction.Left);
      }
    } else {
      if (translationY > 0) {
        setDirection(Direction.Down);
      } else {
        setDirection(Direction.Up);
      }
    }
  };
  return (
    <View style={styles.container}>
      <Header score={score} isPaused={isPaused} onPausePress={() => setIsPaused(!isPaused)} onRestartPress={resetGame} />
      <PanGestureHandler onGestureEvent={handleGesture}>
        <SafeAreaView style={styles.gameContainer}>
          <View style={styles.boundaries}>
              <Snake snake={snake} />
              <Food x={food.x} y={food.y} />
          </View>
        </SafeAreaView>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  gameContainer: {
    flex: 1,
  },

    boundaries: {
        flex: 1,
        borderColor:Colors.primary,
        borderWidth: 12,
        borderRadius: 12,
        backgroundColor: Colors.secondary,
        // margin: 20,
    }
});