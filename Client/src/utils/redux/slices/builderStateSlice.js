import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  builderState: {
    activePage: null,
    pages: null,
  },
};

const builderStateSlice = createSlice({
  name: "builderState",
  initialState,
  reducers: {
    setBuilderState: (state, action) => {
      state.builderState = action.payload;
      // console.log(action.payload);
    },
    clearBuilderState: () => initialState,
  },
});

export const { setBuilderState, clearBuilderState } = builderStateSlice.actions;
export default builderStateSlice.reducer;
