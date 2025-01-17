import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import getRequest from '../request';

export const fetchUserByName = createAsyncThunk(
    'user/fetchUserByName',
    async (userName, { rejectWithValue }) => {
        const response = await getRequest(`/User/Get/${userName}`);

        if (response.status === 200) {
            return response.data;
        }
        return rejectWithValue(response.message);
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserByName.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUserByName.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(fetchUserByName.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default userSlice.reducer;

