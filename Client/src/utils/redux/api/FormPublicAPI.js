import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/public`,
});

export const formPublicAPI = createApi({
  reducerPath: "formPublicAPI",
  baseQuery,
  endpoints: (build) => ({
    postUserResponse: build.mutation({
      query: ({ action, ...response }) => ({
        url: action,
        method: "POST",
        body: response,
      }),
    }),
    getFormPublic: build.mutation({
      query: ({ action, ...response }) => ({
        url: action,
        method: "POST",
        body: response,
      }),
    }),
  }),
});

export const { useGetFormPublicMutation, usePostUserResponseMutation } =
  formPublicAPI;
