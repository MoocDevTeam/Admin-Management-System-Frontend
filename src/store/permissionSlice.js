import { createSlice } from "@reduxjs/toolkit";

const permSlice = createSlice({
  name: "permission",
  initialState: () => {
    const user_permissions = localStorage.getItem("user_permissions");
    if (!user_permissions) {
      return {
        permission: [],
      };
    }
    return {
      permission: JSON.parse(user_permissions),
    };
  },
  reducers: {
    setPermissions(state, action) {
      state.permission = action.payload.permission;
      localStorage.setItem(
        "user_permissions",
        JSON.stringify(action.payload.permission)
      );
    },
    cleanPermission(state, action) {
      state.permission = [];
      localStorage.removeItem("user_permissions");
    },
  },
});

export const { setPermissions, cleanPermission } = permSlice.actions;

export default permSlice;
