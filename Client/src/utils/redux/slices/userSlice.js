import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: () => {
      return { _id: "", name: "", email: "" };
    },
    updateName: (state, action) => {
      state.user.name = action.payload;
    },
  },
});

export const { setUser, clearUser, updateName } = userSlice.actions;
export default userSlice.reducer;

