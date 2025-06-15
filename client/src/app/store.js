import { configureStore } from "@reduxjs/toolkit";
import { injectStore } from "../utils/axiosInstance";
import authReducer from "../features/auth/authSlice"
import userReducer from "../features/user/userSlice"
import { userApi } from "../features/user/userApi";
import { chatApi } from "../features/chat/chatApi";
import { messageApi } from "../features/message/messageApi";
import callReducer from "../features/call/callSlice"

const store = configureStore({
    reducer:{
        auth : authReducer,
        user:userReducer,
        call:callReducer,
        [userApi.reducerPath] : userApi.reducer,
        [chatApi.reducerPath] : chatApi.reducer,
        [messageApi.reducerPath] : messageApi.reducer
    },
    middleware : (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(userApi.middleware).concat(chatApi.middleware).concat(messageApi.middleware)
    
})

injectStore(store)


export default store;