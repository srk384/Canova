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
    deleteForm: build.mutation({
      query: (id) => ({
        url: `/form/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Forms"],
    }),
    renameForm: build.mutation({
      query: ({ id, name }) => ({
        url: `/form/${id}/rename`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["Forms"],
    }),
  }),
});

export const {
  useUpdateFormMutation,
  useGetPagesQuery,
  useDeleteFormMutation,
  useRenameFormMutation,
} = formAPI;
