import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/draftPublish/`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    headers.set("authorization", `Bearer ${token}`);
  },
});

export const draftPublishAPI = createApi({
  reducerPath: "draftPublish",
  baseQuery,
  endpoints: (build) => ({
    saveDraft: build.mutation({
      query: ({ action, ...data }) => ({
        url: action,
        method: "PUT",
        body: data,
      }),
    }),
    getSavedDraft: build.query({
      query: (path) => path,
    }),
  }),
});

export const { useSaveDraftMutation, useGetSavedDraftQuery } = draftPublishAPI;
