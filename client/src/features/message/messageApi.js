import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../utils/axiosBaseQuery";
import api from "../../utils/axiosInstance";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: axiosBaseQuery({ axiosInstance: api }),
  tagTypes: ["Messages"],
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (formData) => ({
        url: "/api/message/send",
        method: "POST",
        data: formData,
      }),
    }),

    getMessages: builder.query({
      query: (chatId) => ({
        url: `/api/message/${chatId}`,
        method: 'GET'
      }),
      providesTags: (result, error, chatId) => [{ type: "Messages", id: chatId }],
    }),

    markMessagesAsSeen: builder.mutation({
      query: (chatId) => ({
        url: "/api/message/seen",
        method: "PATCH",
        data: { chatId },
      }),
    }),

     deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `/api/message/${messageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, messageId) => [{ type: "Messages" }],
    }),

  }),
});

export const { useSendMessageMutation, useGetMessagesQuery, useDeleteMessageMutation, useMarkMessagesAsSeenMutation } = messageApi;
