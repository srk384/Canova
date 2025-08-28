import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: [],
  sections: [],
  pageColor: "",
};

const questionsSlice = createSlice({
  name: "questionsSlice",
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
      // console.log(action.payload);
    },
    setSections: (state, action) => {
      state.sections = action.payload;
      // console.log(action.payload);
    },
    clearQuestions: () => initialState,
  },
});

export const { setQuestions, setSections, clearQuestions } =
  questionsSlice.actions;
export default questionsSlice.reducer;
