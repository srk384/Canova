import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ui: {
    activePageId: null,
    pageColor: null,
    activeSectionId: null,
    sectionColor: null,
    previewMode: false,
    formName: null,
    uploadModal: false,
    uploadType: null,
    publicWelcomeScreen: true,
  },
};

const uiSlice = createSlice({
  name: "uiSlice",
  initialState,
  reducers: {
    setUi: (state, action) => {
      state.ui = action.payload;
      // console.log(action.payload);
    },
    clearUi: () => initialState,
  },
});

export const { setUi, clearUi } = uiSlice.actions;
export default uiSlice.reducer;
