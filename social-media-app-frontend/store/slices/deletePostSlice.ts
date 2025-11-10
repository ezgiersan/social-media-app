import { deleteData } from "@/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DeletePostState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: DeletePostState = {
  loading: false,
  error: null,
  success: false,
};


export const deletePost = createAsyncThunk<
  { postId: string }, string, { rejectValue: string }
>(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {

      await deleteData(`/post/${postId}`);
      
      return { postId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

const deletePostSlice = createSlice({
  name: "deletePost",
  initialState,
  reducers: {
    resetDeleteState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletePost.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetDeleteState } = deletePostSlice.actions;
export default deletePostSlice.reducer;
