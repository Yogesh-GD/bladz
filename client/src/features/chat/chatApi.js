import { createApi } from "@reduxjs/toolkit/query/react"
import { axiosBaseQuery } from "../../utils/axiosBaseQuery"
import api from "../../utils/axiosInstance"

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: axiosBaseQuery({ axiosInstance: api }),
    tagTypes: ["chat","Chat"],
    endpoints: (builder) => ({
      getSingleChat: builder.query({
  query: (chatId) => ({
    url: `/api/chat/single-chat/${chatId}`,
    method: "GET",
  }),
  providesTags: (result, error, chatId) => [{ type: 'chat', id: chatId }],
}),


        getUserChats: builder.query({
            query: () => ({
                url: `/api/chat`,
                method: "GET",
            }),
            providesTags: ["Chat"],
        }),

        accessChat: builder.mutation({
            query: ({ userId }) => ({
                url: "/api/chat/access-chat",
                method: "POST",
                data: { userId }
            }),
            invalidatesTags: ["Chat"]
        }),

        createGroupChat: builder.mutation({
            query: ( formData ) => ({
                url: "/api/chat/new-group",
                method: "POST",
                data: formData
            }),
            invalidatesTags: ["Chat"]
        }),

        deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `/api/chat/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    leaveGroupChat: builder.mutation({
      query: (chatId) => ({
        url: `/api/chat/${chatId}/leave`,
        method: "PATCH",
      }),
      invalidatesTags: ["Chat"],
    }),

    addGroupMembers: builder.mutation({
  query: ({ groupId, users }) => ({
    url: `/api/chat/${groupId}/add-members`,
    method: 'POST',
    data: { users },
  }),
  invalidatesTags: ['chat'],
}),

removeGroupMember: builder.mutation({
  query: ({ groupId, memberId }) => ({
    url: `/api/chat/${groupId}/remove-member`,
    method: 'PATCH',
    data: { memberId },
  }),
  invalidatesTags: (result, error, { groupId }) => [{ type: 'chat', id: groupId }],
}),


    })

})


export const {
    useGetSingleChatQuery,
    useGetUserChatsQuery,
    useAccessChatMutation,
    useCreateGroupChatMutation,
    useLeaveGroupChatMutation,
    useDeleteChatMutation,
    useAddGroupMembersMutation,
    useRemoveGroupMemberMutation
} = chatApi