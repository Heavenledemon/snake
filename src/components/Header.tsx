import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Colors } from "../styles/colors";
import { JSX } from "react";

interface HeaderProps {
  score: number;
  isPaused: boolean;
  onPausePress: () => void;
  onRestartPress: () => void;
}

export default function Header({ score, isPaused, onPausePress, onRestartPress }: HeaderProps): JSX.Element {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.button} onPress={onRestartPress}>
        <FontAwesome name="refresh" size={24} color={Colors.white} />
      </TouchableOpacity>
      
      <Text style={styles.scoreText}>Score: {score}</Text>
      
      <TouchableOpacity style={styles.button} onPress={onPausePress}>
        {isPaused ? (
          <Ionicons name="play" size={24} color={Colors.white} />
        ) : (
          <Ionicons name="pause" size={24} color={Colors.white} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  button: {
    padding: 10,
  },
});