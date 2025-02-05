import { createSlice } from "@reduxjs/toolkit";

const roleSlice = createSlice({
  name: "role",
  initialState: {
    roleNames: [],
  },
  reducers: {
    setRoleNames: (state, action) => {
      state.roleNames = action.payload;
    },
  },
});

export default roleSlice.reducer;

export const { setRoleNames } = roleSlice.actions;
