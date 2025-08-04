import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conditions: [],
};

const conditionsSlice = createSlice({
  name: "conditions",
  initialState,
  reducers: {
    setConditions: (state, action) => {
      state.conditions = action.payload;
      // console.log(action.payload);
    },
  },
});

export const { setConditions } = conditionsSlice.actions;
export default conditionsSlice.reducer;
