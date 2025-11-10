import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function NothingToShow() {

    const colorScheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
        <IconSymbol size={80} name="camera.circle" color={"#44444E"} />
      <ThemedText>Nothing to show here!</ThemedText>
  </ThemedView>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 60
    },
});
