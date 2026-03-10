import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("user_info");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user_info", JSON.stringify(action.payload));
    },
    clearUser(state) {
      state.user = null;
      localStorage.removeItem("user_info");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
