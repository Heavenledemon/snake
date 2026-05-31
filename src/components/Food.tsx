import {StyleSheet, View, Text} from "react-native";
import {Coordinate} from "../types/types";
import { JSX } from "react";

export default function Food({x, y}: Coordinate): JSX.Element {
    return <Text style={[{ top: y * 10, left: x * 10 }, styles.food]}>🍎</Text>;
}

const styles = StyleSheet.create({
    food: {
        position: "absolute",
        width:20,
        height:20,
        borderRadius: 7,
        color: "red",
    },
});