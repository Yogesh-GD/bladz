import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "../../utils/axiosBaseQuery"
import api from "../../utils/axiosInstance"


export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: axiosBaseQuery({ axiosInstance: api }),
    endpoints: (builder) => ({
        searchUsers: builder.query({
            query: (params) => ({
                url: "/api/user",
                method: 'GET',
                params,
            }),
            serializeQueryArgs: ({ queryArgs }) => {
                return queryArgs.search || "";
            },
            merge: ({ currentCache, newData }) => {
                currentCache.users = [...(currentCache.users || []), ...newData.users];
            },
            forceRefetch: ({ currentArgs, previousArgs }) => {
                return currentArgs?.search !== previousArgs?.search;
            },
            providesTags: ["User"],
        }),

    })
})


export const {
    useSearchUsersQuery,
} = userApi