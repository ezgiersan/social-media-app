import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { putData } from "../../api/api";
import {Post} from "../../types/api";

interface LikeState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: LikeState = {
  loading: false,
  error: null,
  success: false,
};


export const likePost = createAsyncThunk<Post, string, { rejectValue: string }>(
  "post/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await putData<undefined, Post>(
        `/post/${postId}/like`,
        undefined
      );
      
      return response;

    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong!");
    }
  }
);

const likePostSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(likePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success= false;
      })
      .addCase(likePost.fulfilled, (state) => {
        state.loading = false;
        state.success= true;
      })
      .addCase(likePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success= false;
      });
  },
});

export default likePostSlice.reducer;
