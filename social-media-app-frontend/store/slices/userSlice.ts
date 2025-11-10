import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getData } from "../../api/api";
import { User } from "../../types/api";
import { sharePost } from "./createPost";
import { deletePost } from "./deletePostSlice";
import { editUser } from "./editUser";

interface UserState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null
};


export const fetchUserProfile = createAsyncThunk<User, string>(
  "user/fetchProfile",
  async (userId, thunkAPI) => {
    try {
      const data = await getData<User>(`/user/${userId}`);
      return data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sharePost.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.posts.unshift(action.payload);
          state.profile.postsCount += 1;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.posts = state.profile.posts.filter(
            (post) => post.id !== action.payload.postId 
          );
          state.profile.postsCount -= 1;
        }
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        
        if (state.profile) {
          state.profile = {
            ...state.profile,
            username: action.payload.username ?? state.profile.username,
            profilePicture: action.payload.profilePicture ?? state.profile.profilePicture,
          };
        } else {
          state.profile = action.payload;
        }
      })
      
      
  }
});

export default userSlice.reducer;
