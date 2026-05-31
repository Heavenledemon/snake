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
  onQuitPress: () => void;
}

export default function Header({ score, isPaused, onPausePress, onRestartPress, onQuitPress }: HeaderProps): JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      {/* Left Actions */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        {/* Quit / Home Button */}
        <TouchableOpacity 
          style={[styles.button, { borderColor: Colors.electricMagenta, shadowColor: Colors.electricMagenta, backgroundColor: 'rgba(255, 0, 96, 0.08)' }]} 
          onPress={onQuitPress} 
          activeOpacity={0.7}
        >
          <Ionicons name="home-outline" size={18} color={Colors.electricMagenta} />
        </TouchableOpacity>

        {/* Restart Button */}
        <TouchableOpacity style={styles.button} onPress={onRestartPress} activeOpacity={0.7}>
          <Ionicons name="reload-outline" size={18} color={Colors.cyberCyan} />
        </TouchableOpacity>
      </View>

      {/* Score Section */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>CYBER SCORE</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      {/* Pause Button */}
      <TouchableOpacity style={styles.button} onPress={onPausePress} activeOpacity={0.7}>
        {isPaused ? (
          <Ionicons name="play-outline" size={20} color={Colors.cyberCyan} />
        ) : (
          <Ionicons name="pause-outline" size={20} color={Colors.cyberCyan} />
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
    paddingBottom: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.boardBorder,
  },
  scoreContainer: {
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 9,
    fontWeight: "900",
    color: Colors.textSecondary,
    letterSpacing: 4,
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 26,
    fontWeight: "900",
    color: Colors.cyberCyan,
    letterSpacing: 2,
    textShadowColor: Colors.cyberCyanGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  button: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: Colors.cyberCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});