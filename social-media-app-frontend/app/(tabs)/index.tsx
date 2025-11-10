import { useEffect, useState } from "react";
import { Image } from "expo-image";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import NothingToShow from "@/screens/NothingToShow";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Post, Like } from "@/types/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchPosts } from "@/store/slices/getPosts";
import { getToken, getUserId } from "@/utils/auth";
import { likePost } from "@/store/slices/likePostSlice";
import { removeLikePost } from "@/store/slices/removeLikePostSlice";
import { getFullImageUrl } from "@/utils/getFullImageUrl";

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.posts);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUserId = async () => {
      const userId = await getUserId();
      setCurrentUserId(userId);
    };
    getCurrentUserId();
  }, []);


  useEffect(() => {
    const checkTokenAndFetch = async () => {
      const token = await getToken();
      if (token) {
        dispatch(fetchPosts());
      }
    };

    checkTokenAndFetch();
  }, [dispatch]);

  const likeImage = (imageId: string) => {
    dispatch(likePost(imageId));
  };

  const unLikeImage = (imageId: string) => {
    dispatch(removeLikePost(imageId));
  };

  const renderPostItem = ({ item }: { item: Post }) => {
    // const fullImageUrl = `${process.env.EXPO_PUBLIC_IMAGE_URL}${item.image}`;
    const fullImageUrl = getFullImageUrl(item.image);
    
    // const isLiked = likedPosts[item.id];
    const isLiked = item.likes.some(
      (like: Like) => like.userId === currentUserId
    );
    return (
      <View style={styles.card}>
        <Image source={{ uri: fullImageUrl }} style={styles.image} />
        <Text style={styles.usernameText}>{item.username}</Text>
        <View style={styles.likeContainer}>
          <TouchableOpacity
            onPress={() =>
              isLiked ? unLikeImage(item.id) : likeImage(item.id)
            }
          >
            <IconSymbol
              size={20}
              name={isLiked ? "heart.fill" : "heart"}
              color={isLiked ? "#DC2525" : "white"}
            />
          </TouchableOpacity>
          <Text style={styles.likesText}>{item.likesCount}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <FlatList
        data={Array.isArray(posts) ? posts : []}
        extraData={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPostItem}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<NothingToShow />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 50,
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    // width: itemSize,
    borderRadius: 12,
    overflow: "hidden",
    // backgroundColor: '#fff',
    marginBottom: 20,
    flex: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  likesText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 3,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 3,
    left: 3,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  usernameText: {
    color: "#fff",
    position: "absolute",
    top: 3,
    left: 3,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
});
