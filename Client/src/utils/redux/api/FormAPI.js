import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/forms`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    headers.set("authorization", `Bearer ${token}`);
  },
});

export const formAPI = createApi({
  reducerPath: "formAPi",
  baseQuery,
  endpoints: (build) => ({
    updateForm: build.mutation({
      query: ({ action, ...data }) => ({
        url: action,
        method: "POST",
        body: data,
      }),
    }),
    getPages: build.query({
      query: (path) => path,
    }),
  }),
});

export const { useUpdateFormMutation, useGetPagesQuery } = formAPI;
