import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";


export const getAllUsers = createAsyncThunk("user/get", async (query, { rejectWithValue }) => {
    try {
        const response = await api.get("/api/user", { params: query })
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userList: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false
                state.userList = action.payload.users
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false
            })

    }
})


export default userSlice.reducer;