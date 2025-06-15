import axios from "axios"
import { logoutUser } from "../features/auth/authSlice"

let store 

export const injectStore = (_store) => {
    store = _store
}

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
})


let isRefreshing = false
let failedRequestsQueue = []

api.interceptors.request.use(
    (config) => {
        const state = store.getState()
        const token = state.auth.accessToken;

        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if(error?.response.status === 401 && !originalRequest._retry){
            if(isRefreshing){
                return new Promise((resolve,reject) => {
                    failedRequestsQueue.push({resolve,reject,originalRequest})
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const state = store.getState()
                const response = await api.post(`http://localhost:3000/api/auth/user/refresh-token`)

                failedRequestsQueue.forEach(({resolve,reject}) => {
                    resolve(api(originalRequest))
                })

                failedRequestsQueue = []
                return api(originalRequest)
                
            } catch (refreshError) {
                store.dispatch(logoutUser())
                failedRequestsQueue.forEach(({reject}) => reject(refreshError))
                failedRequestsQueue = []
                return Promise.reject(refreshError)
            }finally{
                isRefreshing = false
            }
        }


        return Promise.reject(error)
    }
)


export default api