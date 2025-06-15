import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";
import Cookies from "js-cookie"

export const registerUser = createAsyncThunk("auth/registerUser", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.post("/api/auth/user/register", formData)
        return response.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const loginUser = createAsyncThunk("auth/loginUSer", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.post("/api/auth/user/login", formData)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const logoutUser = createAsyncThunk("auth/logoutUSer", async (_, { rejectWithValue }) => {
    try {
        const response = await api.delete("/api/auth/user/logout")
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const getUserProfile = createAsyncThunk("auth/profile", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/api/user/profile")
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


export const updateUserProfile = createAsyncThunk("auth/update-profile", async (data, { rejectWithValue }) => {
    try {
        const response = await api.patch("/api/user/update-profile",data,{headers:{"Content-Type":" 'multipart/form-data'"}})
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})


export const updateUserEmail = createAsyncThunk("auth/update-email", async (data, { rejectWithValue }) => {
    try {
        const response = await api.patch("/api/user/update-email",data)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const changeUserPassword = createAsyncThunk("auth/change-password", async (email, { rejectWithValue }) => {
    try {
        const response = await api.patch("/api/user/change-password",email)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const updateMobile = createAsyncThunk("auth/update-mobile", async (mobile, { rejectWithValue }) => {
    try {
        const response = await api.patch("/api/user/update-mobile",mobile)
        return response.data.data
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        userLoading:true,
        loading: false,
        formError: null,
        error: null,
        status: "idle",
        isUSerAuthenticated: false,
    },
    reducers: {
        clearAuthError: (state) => {
            state.formError = null
        },
        clearStatus: (state) => {
            state.status = "idle"
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.formError = false,
                    state.status = "submitting"
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false
                state.status = "success"
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.formError = action.payload.message || 'Registration failed'
                state.loading = false
                state.status = "failed"
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.formError = false
                state.status = "submitting"
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false
                state.status = "success"
                state.isUSerAuthenticated = true

            })
            .addCase(loginUser.rejected, (state, action) => {
                state.formError = action.payload.message
                state.loading = false
                state.status = "failed"
                state.isUSerAuthenticated = false


            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true
                state.formError = false
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false
                state.isUSerAuthenticated = false


            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.formError = action.payload
                state.loading = false
                state.isUSerAuthenticated = false

            })
            .addCase(getUserProfile.pending, (state) => {
                state.userLoading = true
                state.error = null
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.userLoading = false
                state.user = action.payload
                state.isUSerAuthenticated = true
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.userLoading = false
                state.error = "error"
            })
            .addCase(  updateUserProfile.pending,(state) => {
                state.loading = true
                state.status = "updating"
                state.formError = null
            })
            .addCase(updateUserProfile.fulfilled,(state,action) => {
                state.user = action.payload
                state.loading = false
                state.status = "updated"
            })
            .addCase(updateUserProfile.rejected,(state,action) => {
                state.loading = false
                state.formError = action.payload || "error in updating profile"
                state.status = "failed"
            })
            .addCase( updateUserEmail.pending,(state) => {
                state.loading = true
                state.status = "updating"
                state.formError = null
            })
            .addCase(updateUserEmail.fulfilled,(state,action) => {
                state.user = action.payload
                state.loading = false
                state.status = "updated"
            })
            .addCase(updateUserEmail.rejected,(state,action) => {
                state.loading = false
                state.formError = action.payload || "error in updating email"
                state.status = "failed"
            })
            .addCase( changeUserPassword.pending,(state) => {
                state.loading = true
                state.status = "updating"
                state.formError = null
            })
            .addCase(changeUserPassword.fulfilled,(state,action) => {
                state.loading = false
                state.status = "updated"
            })
            .addCase(changeUserPassword.rejected,(state,action) => {
                state.loading = false
                state.formError = action.payload || "error in changing password"
                state.status = "failed"
            })
            .addCase( updateMobile.pending,(state) => {
                state.loading = true
                state.status = "updating"
                state.formError = null
            })
            .addCase(updateMobile.fulfilled,(state,action) => {
                state.loading = false
                state.status = "updated"
            })
            .addCase(updateMobile.rejected,(state,action) => {
                state.loading = false
                state.formError = action.payload || "error in updating mobile number"
                state.status = "failed"
            })

    }
})

export const { clearAuthError,clearStatus} = authSlice.actions

export default authSlice.reducer