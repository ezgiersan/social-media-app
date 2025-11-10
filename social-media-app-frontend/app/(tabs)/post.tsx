import { showToast } from "@/components/ToastProvider";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { getUserId } from "@/utils/auth";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "../../components/ui/ProgressBar";
import { AppDispatch, RootState } from "../../store";
import { sharePost } from "../../store/slices/createPost";


export default function Post() {
  const [image, setImage] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { post, error, success } = useSelector(
    (state: RootState) => state.post
  );

  useEffect(() => {
    if (success) {
      setLoading(false);
      router.replace("/");
      removeImage();
    } 
  }, [success]);

  useEffect(() => {
    if (error) {
      showToast("error", "Something Went Wrong!")
      setLoading(false);
    }
  }, [error]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitPost = async () => {
    setLoading(true);
    const userId = await getUserId();

    const formData = new FormData();
    if (image) {
      formData.append("media", {
        uri: image,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);
    }

    formData.append("userId", userId ?? "");

    dispatch(sharePost(formData));
  };

  const removeImage = () => setImage(null);

  return (
    <SafeAreaView>
      <View style={styles.topArea}>
        <TouchableOpacity style={styles.submitButton} onPress={submitPost}>
          <Text style={styles.buttonText}>Share Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        {image ? (
          <TouchableOpacity style={styles.closeIcon} onPress={removeImage}>
            <IconSymbol size={20} name="xmark" color="white" />
          </TouchableOpacity>
        ) : (
          ""
        )}
        <View style={styles.progressBarContainer}>
        <ProgressBar visible={loading}/>

        </View>

        <TouchableOpacity
          style={styles.imageBox}
          onPress={image ? undefined : pickImage}
          activeOpacity={image ? 1 : 0.7}
        >
          {image ? (
            <>
              <Image source={{ uri: image }} style={styles.pickedImage} />
            </>
          ) : (
            <Text style={styles.placeholderText}>Pick an image</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topArea: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
  },
  submitButton: {
    backgroundColor: "#5A47AB",
    borderRadius: 50,
    // paddingLeft: 10,
    paddingInline: 20,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#fff",
  },
  imageBox: {
    height: 500,
    borderRadius: 60,
    // borderWidth: 1,
    // borderColor: '#555',
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  placeholderText: { color: "#113F67", fontSize: 16 },
  pickedImage: { width: "100%", height: "100%", resizeMode: "cover" },
  closeIcon: {
    position: "absolute",
    top: 35,
    right: 35,
    backgroundColor: "#000",
    borderRadius: 40,
    padding: 5,
    zIndex: 1,
    opacity: 0.7,
  },
  imageContainer: {
    padding: 30,
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 18 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
  },
  progressBarContainer: {
    height: 15,
    marginHorizontal: 30,
  },
});
