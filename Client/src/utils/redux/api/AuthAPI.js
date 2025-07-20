import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/auth/`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    headers.set("authorization", `Bearer ${token}`);
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (build) => ({
    authentication: build.mutation({
      query: ({ action, ...post }) => ({
        url: action,
        method: "POST",
        body: post,
      }),
    }),
  }),
});

export const { useAuthenticationMutation } = authApi;
