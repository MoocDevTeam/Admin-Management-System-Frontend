import { createSlice } from "@reduxjs/toolkit";

const roleSlice = createSlice({
  name: "role",
  initialState: {
    roleNames: { items: [], total: 0 },
  },
  reducers: {
    setRoleNames: (state, action) => {
      state.roleNames = action.payload;
    },
  },
});

export default roleSlice.reducer;

export const { setRoleNames } = roleSlice.actions;
