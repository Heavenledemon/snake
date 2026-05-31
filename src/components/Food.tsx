import { StyleSheet, View, Text } from "react-native";
import { Coordinate } from "../types/types";
import { JSX } from "react";
import { Colors } from "../styles/colors";

export default function Food({ x, y }: Coordinate): JSX.Element {
    return (
        <View style={[{ top: y * 10, left: x * 10 }, styles.wrapper]}>
            <View style={styles.glow} />
            <Text style={styles.food}>🍎</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        width: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    glow: {
        position: "absolute",
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.neonPinkGlow,
        shadowColor: Colors.neonPink,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 15,
    },
    food: {
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
    },
});