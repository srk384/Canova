import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    headers.set("authorization", `Bearer ${token}`);
  },
});

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery,
  endpoints: (build) => ({
    createProject: build.mutation({
      query: ({ action, ...project }) => ({
        url: action,
        method: "POST",
        body: project,
      }),
    }),
    getProjects: build.query({
      query: (path) => path,
    }),
    getForms: build.query({
      query: (path) => path,
    }),
    getSharedForms: build.query({
      query: (path) => path,
    }),
    deleteSharedAccess: build.mutation({
      query: (formId) => ({
        url: `/forms/${formId}/access/remove`,
        method: "DELETE",
      }),
    }),

    deleteProject: build.mutation({
      query: (id) => ({
        url: `/projects/${id}/delete`,
        method: "DELETE",
      }),
    }),

    renameProject: build.mutation({
      query: ({ id, name }) => ({
        url: `/projects/${id}/rename`,
        method: "PUT",
        body: { name },
      }),
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useGetProjectsQuery,
  useGetFormsQuery,
  useGetSharedFormsQuery,
  useDeleteSharedAccessMutation,
  useDeleteProjectMutation,
  useRenameProjectMutation,
} = projectsApi;
