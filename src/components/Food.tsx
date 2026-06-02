import { StyleSheet, View, Text, Animated, Easing } from "react-native";
import { FoodItem } from "../types/types";
import { JSX, useRef, useEffect, memo } from "react";

interface FoodProps {
    item: FoodItem;
}

const FoodComponent = ({ item }: FoodProps): JSX.Element => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Continuous, smooth breathing cycle
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.16,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.86,
                    duration: 900,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={[{ top: item.y * 10, left: item.x * 10 }, styles.wrapper]}>
            {/* Animated breathing neon aura glow */}
            <Animated.View style={[
                styles.glow, 
                { 
                    backgroundColor: item.glowColor, 
                    shadowColor: item.glowColor,
                    transform: [{ scale: scaleAnim }]
                }
            ]} />
            
            {/* Animated breathing food emoji core */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Text style={styles.emoji}>{item.emoji}</Text>
            </Animated.View>
        </View>
    );
}

export default memo(FoodComponent, (prevProps, nextProps) => {
    return prevProps.item.id === nextProps.item.id && 
           prevProps.item.emoji === nextProps.item.emoji &&
           prevProps.item.points === nextProps.item.points;
});

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        width: 22,
        height: 22,
        alignItems: "center",
        justifyContent: "center",
    },
    glow: {
        position: "absolute",
        width: 24,
        height: 24,
        borderRadius: 12,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 12,
    },
    emoji: {
        fontSize: 16,
        textAlign: "center",
        lineHeight: 22,
    },
});