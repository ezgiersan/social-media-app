import { useMemo, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { showToast } from "@/components/ToastProvider";
import { AppDispatch, RootState } from "@/store";
import { editUser } from "@/store/slices/editUser";
import { getFullImageUrl } from "@/utils/getFullImageUrl";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileEdit() {
  const { profile } = useSelector((state: RootState) => state.user);

  const initialUsername = profile?.username || "";
  const initialImage =
    profile?.profilePicture !== undefined
      ? getFullImageUrl(profile?.profilePicture) 
      : "https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png";

  const [username, setUsername] = useState(initialUsername);
  const [image, setImage] = useState(initialImage);

  const dispatch = useDispatch<AppDispatch>();

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

  const saveChanges = async () => {
    const hasChangesNow =
      username !== initialUsername || image !== initialImage;

    if (!hasChangesNow) {
      console.log("No changes detected.");
      return;
    }

    // const userId = await getUserId();
    const formData = new FormData();

    if (image !== initialImage) {
      formData.append("image", {
        uri: image,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);
    }

    if (username !== initialUsername) {
      formData.append("username", username);
    }
    dispatch(editUser({formData})).unwrap().then(() => {
      showToast("success", "Profile Updated Successfully!")
      router.replace("/profile");
    }).catch(()=> {
      showToast("error", "Something Went Wrong!")
    })
  };

  //image veya username değiştiğinde butonu göster
  const hasChanges = useMemo(() => {
    return username !== initialUsername || image !== initialImage;
  }, [image, username, initialImage, initialUsername]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.imageContainer}>
        <Image
          source={{
            uri: image,
          }}
          style={styles.avatar}
        />
        <TouchableOpacity onPress={pickImage}>
          <ThemedText style={styles.editPictureText}>
            Edit Profile Picture
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ThemedView style={styles.line}></ThemedView>
      <ThemedView style={styles.userInfoContainer}>
        <ThemedText style={styles.label}>Username:</ThemedText>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </ThemedView>
      {hasChanges && (
        <ThemedView style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
            <ThemedText style={styles.buttonText}>Save Changes</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 45,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#C9C9C9",
    marginTop: 40,
  },
  input: {
    // flex: 1,
    width: "100%",
    backgroundColor: "#eeecf6",
    borderWidth: 0,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 45,
    shadowColor: "#dedaee",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 4,
    // borderBottomWidth: 1,
    // borderColor: "#7a6bbb"
  },
  editPictureText: {
    color: "#5A47AB",
    marginTop: 10,
  },
  imageContainer: {
    alignItems: "center",
  },
  label: {
    marginBottom: 10,
  },
  line: {
    borderWidth: 0.9,
    borderColor: "#aca3d5",
    width: "100%",
    marginVertical: 30,
    // shadowColor: "#aca3d5",
    // shadowOffset: { width: 2, height: 2 },
    // shadowOpacity: .8,
  },
  userInfoContainer: {
    paddingHorizontal: 30,
  },
  saveButtonContainer: {
    justifyContent: "flex-end",
  },
  saveButton: {
    marginTop: 50,
    backgroundColor: "#5A47AB",
    paddingInline: 20,
    paddingVertical: 15,
    borderRadius: 45,
    // alignSelf: "flex-end",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
});
