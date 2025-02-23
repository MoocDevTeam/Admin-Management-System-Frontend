// getAvatarById

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getRequest from "../request/getRequest";

export const getAvatarByUserName = createAsyncThunk(
    "avatar/getAvatarByUserName",
    async (userName, { rejectWithValue }) => {
        const response = await getRequest(`/Avatar/GetAvatar/${userName}`);
        if (response.avatarUrl !== null) {
            return response;
        }
        return rejectWithValue(response.message);
    }
);

const avatarSlice = createSlice({
    name: "avatar",
    initialState: {
        avatar: {
            avatarUrl: "",
        },
        status: "idle",
        error: null,
    },
    reducer: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAvatarByUserName.pending, (state) => {
                state.Status = "loading";
                state.error = null;
                console.log("Avatar loading")
            })
            .addCase(getAvatarByUserName.fulfilled, (state, action) => {
                state.Status = "succeeded";
                state.avatar = action.payload;
                console.log("Avatar success")
            })
            .addCase(getAvatarByUserName.rejected, (state, action) => {
                state.Status = "failed";
                state.error = action.payload;
                console.log("Avatar failed");
            });
    },
});

export default avatarSlice.reducer;