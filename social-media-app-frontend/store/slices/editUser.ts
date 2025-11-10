import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { putFormData } from "../../api/api";
import { User } from "../../types/api";

interface EditUserState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: EditUserState = {
  loading: false,
  error: null,
  success: false,
};

export const editUser = createAsyncThunk<
  User,
  { formData: FormData },
  { rejectValue: string }
>(
  "user/edit",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await putFormData<User>(`/user/edit`, formData);
      
      return response;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong!"
      );
    }
  }
);


const editUserSlice = createSlice({
  name: "editUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export default editUserSlice.reducer;
