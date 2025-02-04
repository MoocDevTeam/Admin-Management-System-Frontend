import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import getRequest from "../../request";
import postRequest from "../../request/postRequest";

let baseUrl = process.env.REACT_APP_BASE_API_URL;
export const fetchUserByName = createAsyncThunk(
  "user/fetchUserByName",
  async (userName, { rejectWithValue }) => {
    const response = await getRequest(`/User/Get/${userName}`);
    if (response.status === 200) {
      return response.data;
    }
    return rejectWithValue(response.message);
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (updateUserData, { rejectWithValue }) => {
    const response = await postRequest(
      `${baseUrl}/api/user/update`,
      updateUserData
    );

    if (response === 200) {
      return response.data;
    }
    return rejectWithValue(response.message);
  }
);

const userNameFromLocalStorage = localStorage.getItem("username") || "admin";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      userName: userNameFromLocalStorage,
      password: "",
      email: "admin@demo.com",
      age: 30,
      access: 0,
    },
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserByName.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserByName.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserByName.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
