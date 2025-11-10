import { MenuOption } from "@/components/MenuOption";
import { IconSymbol } from "@/components/ui/IconSymbol";
import NothingToShow from "@/screens/NothingToShow";
import { fetchUserProfile } from "@/store/slices/userSlice";
import { Post } from "@/types/api";
import { getUserId } from "@/utils/auth";
import { getFullImageUrl } from "@/utils/getFullImageUrl";
import { Image } from "expo-image";
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import {
  FlatList, StyleSheet,
  Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { DropdownMenu } from "../../components/DropdownMenu";
import { AppDispatch, RootState } from "../../store";
import { logoutUser } from "../../store/slices/authSlice";

export default function TabTwoScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { profile, loading } = useSelector((state: RootState) => state.user);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      const userId = await getUserId();

      if (userId) {
        dispatch(fetchUserProfile(userId));
      }
    };

    loadUserProfile();
  }, [dispatch]);


  const renderHeader = () => (
    <View>
      <View style={styles.avatarAndNumberContainer}>
        <Image
          source={{
            uri:
              profile?.profilePicture !== undefined
                ? getFullImageUrl(profile?.profilePicture)
                : "https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png",
          }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{profile?.username}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile?.postsCount}</Text>
              <Text style={styles.statTitle}>posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile?.followersCount}</Text>
              <Text style={styles.statTitle}>followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{profile?.followingCount}</Text>
              <Text style={styles.statTitle}>following</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.editButtonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={()=> router.push("/modals/profile-edit")}>
          <Text>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPostItem = ({ item }: { item: Post }) => {
    const fullImageUrl = getFullImageUrl(item.image);

    return (
      <TouchableOpacity style={styles.card}   onPress={() =>
        router.push({
          pathname: "/modals/post-details",
          params: {
            id: item.id,
            image: item.image,
            createdAt: item.createdAt,
            likesCount: item.likesCount,
          },
        })
      }>
        <Image source={{ uri: fullImageUrl }} style={styles.image} />
        {/* <View style={styles.likeContainer}>
          <IconSymbol size={18} name="heart" color={"white"} />
          <Text style={styles.likesText}>{item.likesCount}</Text>
        </View> */}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.settingArea}>
        <DropdownMenu
          visible={visible}
          handleOpen={() => setVisible(true)}
          handleClose={() => setVisible(false)}
          trigger={<IconSymbol size={28} name="gear" color={"#000"} />}
        >
          <MenuOption
            onSelect={() => {
              setVisible(false);
              dispatch(logoutUser());
              router.push('/login');
            }}
          >
            <Text>Log Out</Text>
          </MenuOption>
        </DropdownMenu>
      </View>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={profile?.posts ?? []}
        keyExtractor={(item) => item.id}
        // key={'grid-3'}
        numColumns={3}
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
    paddingBottom: 50
  },
  contentContainer: {
    padding: 20,
  },
  avatarAndNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 45,
    marginRight: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#C9C9C9",
  },
  userInfo: { flex: 1 },
  username: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  stat: {
    alignItems: "flex-start",
    flex: 1,
  },
  statNumber: { fontWeight: "bold", fontSize: 18 },
  statTitle: { fontSize: 13, color: "grey", marginTop: 4 },
  editButtonContainer: {
    marginTop: 15,
    marginBottom: 25,
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#e5e5e5",
    paddingVertical: 7,
    borderRadius: 20,
    alignItems: "center",
  },
  postContainer: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    marginTop: 40,
    minHeight: "100%",
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    margin: 2,
    flex: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    maxWidth: 126,
  },
  image: {
    width: "100%",
    height: 150,
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
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  settingArea: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
  },
  triggerStyle: {
    height: 40,
    // backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  triggerText: {
    fontSize: 16,
  },
});
