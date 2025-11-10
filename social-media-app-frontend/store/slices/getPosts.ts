import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getData } from "../../api/api";
import { Post } from "../../types/api";
import { sharePost } from "./createPost";
import { deletePost } from "./deletePostSlice";
import { likePost } from "./likePostSlice";
import { removeLikePost } from "./removeLikePostSlice";

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null,
  success: false
};


export const fetchPosts = createAsyncThunk<Post[]>(
  'posts/fetchPosts',
  async () => {
    const posts = await getData<Post[]>('/post');
    return posts;
  }
);


const getPostsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.success = true;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // likePost başarılı olduğunda ilgili post’un like sayısını güncelle
      .addCase(likePost.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.posts.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          state.posts[index] = updated;
        }
      })
      .addCase(removeLikePost.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.posts.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          state.posts[index] = updated;
        }
      })
      .addCase(sharePost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
      
        const index = state.posts.findIndex((post) => post.id === postId);
        if (index !== -1) {
          state.posts.splice(index, 1);
        }
      });
  }
});

export default getPostsSlice.reducer;
