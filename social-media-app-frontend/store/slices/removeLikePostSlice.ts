import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { putData } from "../../api/api";
import {Post} from "../../types/api";

interface RemoveLikeState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: RemoveLikeState = {
  loading: false,
  error: null,
  success: false,
};


export const removeLikePost = createAsyncThunk<Post, string, { rejectValue: string }>(
  "post/removeLike",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await putData<undefined, Post>(
        `/post/${postId}/removeLike`,
        undefined
      );

      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong!");
    }
  }
);

const removeLikePostSlice = createSlice({
  name: "removeLike",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(removeLikePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success= false;
      })
      .addCase(removeLikePost.fulfilled, (state) => {
        state.loading = false;
        state.success= true;
      })
      .addCase(removeLikePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success= false;
      });
  },
});

export default removeLikePostSlice.reducer;
