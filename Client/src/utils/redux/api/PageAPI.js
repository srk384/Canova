import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/pages`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    headers.set("authorization", `Bearer ${token}`);
  },
});

export const pageAPi = createApi({
  reducerPath: "pageAPi",
  baseQuery,
  endpoints: (build) => ({
    addPages: build.mutation({
      query: ({ action, ...data }) => ({
        url: action,
        method: "POST",
        body: data,
      }),
    }),
    updatePages: build.mutation({
      query: ({ action, ...data }) => ({
        url: action,
        method: "PATCH",
        body: data,
      }),
    }),
    getPages: build.query({
      query: (path) => path,
    }),
  }),
});

export const { useAddPagesMutation, useGetPagesQuery, useUpdatePagesMutation } =
  pageAPi;
