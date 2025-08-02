import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../api/AuthAPI";
import { formAPI } from "../api/FormAPI";
import { projectsApi } from "../api/ProjectAPI";
import { pageAPi } from "../api/PageAPI";
import { draftPublishAPI } from "../api/draftPublishAPI";
import { formPublicAPI } from "../api/FormPublicAPI";
import questionsSliceReducer from "../slices/questionsSlice";
import uiSliceReducer from "../slices/uiSlice";
import userSliceReducer from "../slices/userSlice";
import builderStateSliceReducer from "../slices/builderStateSlice";
import conditionsSliceReducer from "../slices/conditionsSlice";

export const store = configureStore({
  reducer: {
    user: userSliceReducer,
    uiSlice: uiSliceReducer,
    questionsSlice: questionsSliceReducer,
    questionsSlice: questionsSliceReducer,
    builderState: builderStateSliceReducer,
    conditions: conditionsSliceReducer,
    [authApi.reducerPath]: authApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [formAPI.reducerPath]: formAPI.reducer,
    [pageAPi.reducerPath]: pageAPi.reducer,
    [draftPublishAPI.reducerPath]: draftPublishAPI.reducer,
    [formPublicAPI.reducerPath]: formPublicAPI.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      projectsApi.middleware,
      formAPI.middleware,
      pageAPi.middleware,
      draftPublishAPI.middleware,
      formPublicAPI.middleware
    ),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
