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
    getProjects:build.query({
        query:(path)=>path
    }),
    getForms:build.query({
        query:(path)=>path
    })
  }),
});

export const { useCreateProjectMutation, useGetProjectsQuery, useGetFormsQuery } = projectsApi;
