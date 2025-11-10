import { AppDispatch } from "@/store";
import { deletePost } from "@/store/slices/deletePostSlice";
import { getFullImageUrl } from "@/utils/getFullImageUrl";
import { format } from "date-fns";
import { BlurView } from "expo-blur";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Alert, Animated, Image,
  StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { useDispatch } from "react-redux";

export default function PostDetailModal() {
  const { id, image, createdAt, likesCount } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // animasyon değeri
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          
          await dispatch(deletePost(id as string));
        
          router.back();
        },
      },
    ]);
  };

  const imageUrl = () => {
    const imgUrl = getFullImageUrl(image as string);
    return imgUrl
  }
  
  return (
    <BlurView intensity={40} tint="dark" style={styles.overlay}>
      <Stack.Screen options={{ presentation: "transparentModal", headerShown: false }} />

      <Animated.View
        style={[
          styles.modalBox,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={{ uri: imageUrl() }}
          style={styles.postImage}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.dateText}>
            {format(new Date(createdAt as string), "dd MMM yyyy, HH:mm")}
          </Text>
          <Text style={styles.likesText}>❤️ {likesCount} likes</Text>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Post</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </Animated.View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#45454a",
    borderRadius: 30,
    width: "90%",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    alignItems: "center",
  },
  postImage: {
    width: "100%",
    height: 300,
    borderRadius: 20,
    marginBottom: 16,
  },
  infoContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  dateText: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 4,
  },
  likesText: {
    color: "#ff6b6b",
    fontWeight: "600",
  },
  deleteButton: {
    marginTop: 20,
    backgroundColor: "#ff3b30",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 12,
  },
  closeText: {
    color: "#ccc",
    fontSize: 22,
  },
});
