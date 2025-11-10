import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol"; // ikon bileşeni
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const { width } = Dimensions.get("window");

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          if (index === Math.floor(state.routes.length / 2)) {
            return <View key={route.key} style={{ flex: 1 }} />;
          }
          // const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const onPress = () => {
            if (!isFocused) navigation.navigate(route.name);
          };
          const iconName =
            route.name === "index"
              ? "house.fill"
              : route.name === "post"
              ? "plus"
              : route.name === "profile"
              ? "person.circle"
              : "questionmark";

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
            >
              <IconSymbol
                name={iconName}
                size={28}
                color={isFocused ? "#5A47AB" : "#999"}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Floating + butonu */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("post")}
      >
        <IconSymbol name="plus" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 10,
    width,
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 40,
    width: width * 0.9,
    height: 60,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    elevation: 5,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    top: -30,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#5A47AB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#5A47AB",
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
  },
});
