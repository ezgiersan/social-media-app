import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface UserData {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false,
};



//Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}auth/login`, {
        email,
        password,
      });
      // const token = res.data.token;
      const { token, user } = res.data;
      
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userInfo", JSON.stringify(user));

      return token;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    { username, email, password }: { username: string; email: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}auth/register`, {
        username,
        email,
        password,
      });
      // const token = res.data.token;
      const { token, user } = res.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userInfo", JSON.stringify(user));

      return token;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Register failed"
      );
    }
  }
);


//Logout
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await Promise.all([
    AsyncStorage.removeItem("token"),
    AsyncStorage.removeItem("userInfo"),
  ]);
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isLoggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLoggedIn = false;
      })

       // Register
       .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isLoggedIn = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLoggedIn = false;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
