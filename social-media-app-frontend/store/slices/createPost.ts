import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postFormData } from "../../api/api";
import { Post } from "../../types/api";

interface PostState {
  post: Post | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: PostState = {
  post: null,
  loading: false,
  error: null,
  success: false
};


export const sharePost = createAsyncThunk<Post, FormData>(
  "post/createPost",
  async (formData, thunkAPI) => {
    try {
      const data = await postFormData<Post>("/post/createPost", formData);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const createPostSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset(state) {
      state.success = false;
      state.loading = false;
      state.error = null;
      state.post = null;

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sharePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sharePost.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
        state.success = true;
      })
      .addCase(sharePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { reset } = createPostSlice.actions;

export default createPostSlice.reducer;
