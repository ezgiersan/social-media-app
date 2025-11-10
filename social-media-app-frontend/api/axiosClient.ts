
import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const axiosClient = axios.create({
  //Geçici olarak string verildi
  baseURL: process.env.EXPO_PUBLIC_API_URL,
//   baseURL: 'http://192.168.1.5:5000/api/',
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});


axiosClient.interceptors.request.use(
  async (config) => {
    // const state = store.getState();
    // const token = state.auth.token;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    const token = await AsyncStorage.getItem('token');
    
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);


axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // store.dispatch(logoutUser());
      
      await AsyncStorage.removeItem("token");

      const { store } = await import("../store");
      const { logoutUser } = await import("../store/slices/authSlice");
      store.dispatch(logoutUser());
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
