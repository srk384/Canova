import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import userSliceReducer from '../slices/userSlice'
import uiSliceReducer from '../slices/uiSlice'
import { authApi } from "../api/AuthAPI";
import { projectsApi } from "../api/ProjectAPI";
import { formAPI } from "../api/FormAPI";

export const store = configureStore({
  reducer: {
     user: userSliceReducer,
     uiSlice: uiSliceReducer,
    [authApi.reducerPath]: authApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [formAPI.reducerPath]: formAPI.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,projectsApi.middleware, formAPI.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)