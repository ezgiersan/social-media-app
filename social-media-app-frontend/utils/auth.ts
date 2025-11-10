import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getToken(): Promise<string | null> {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (err) {
    return null;
  }
}

export async function getUserId(): Promise<string | null> {
  try {
    const userString = await AsyncStorage.getItem('userInfo');
    
    if (userString) {
      const user = JSON.parse(userString);
      return user.id || null;
    }
    return null;
  } catch (error) {
    return null;
  }
}