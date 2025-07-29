import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  builderState: {},
};

const builderStateSlice = createSlice({
  name: "builderState",
  initialState,
  reducers: {
    setBuilderState: (state, action) => {
      state.builderState = action.payload;
      console.log(action.payload);
    },
  },
});

export const { setBuilderState } = builderStateSlice.actions;
export default builderStateSlice.reducer;
