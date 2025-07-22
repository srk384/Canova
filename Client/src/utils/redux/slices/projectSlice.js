import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  project: []
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setProject } = projectSlice.actions;
export default projectSlice.reducer;
