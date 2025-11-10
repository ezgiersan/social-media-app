import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import createPostReducer from "./slices/createPost";
import deletePostSlice from './slices/deletePostSlice';
import editUser from './slices/editUser';
import getPostsReducer from "./slices/getPosts";
import likePostSlice from './slices/likePostSlice';
import removeLikePostSlice from './slices/removeLikePostSlice';
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    post: createPostReducer,
    posts: getPostsReducer,
    likePost: likePostSlice,
    removeLikePost: removeLikePostSlice,
    deletePost: deletePostSlice,
    editUser: editUser
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
