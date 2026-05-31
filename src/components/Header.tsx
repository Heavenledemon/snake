import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../styles/colors";
import { JSX } from "react";

interface HeaderProps {
  score: number;
  isPaused: boolean;
  onPausePress: () => void;
  onRestartPress: () => void;
}

export default function Header({ score, isPaused, onPausePress, onRestartPress }: HeaderProps): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      {/* Restart Button */}
      <TouchableOpacity style={styles.button} onPress={onRestartPress} activeOpacity={0.7}>
        <FontAwesome name="refresh" size={18} color={Colors.neonGreen} />
      </TouchableOpacity>

      {/* Score Section */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>SCORE</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      {/* Pause Button */}
      <TouchableOpacity style={styles.button} onPress={onPausePress} activeOpacity={0.7}>
        {isPaused ? (
          <Ionicons name="play" size={20} color={Colors.neonGreen} />
        ) : (
          <Ionicons name="pause" size={20} color={Colors.neonGreen} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.boardBorder,
    shadowColor: Colors.neonGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  scoreContainer: {
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.textSecondary,
    letterSpacing: 3,
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.neonGreen,
    letterSpacing: 2,
    shadowColor: Colors.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.buttonBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.buttonBorder,
    shadowColor: Colors.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
});