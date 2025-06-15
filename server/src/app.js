import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv"

const app  = express()

dotenv.config({
    path: './.env'
})

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(cors({
    origin:["http://localhost:5173","http://192.168.157.82:5173"],
    credentials:true
}))


import authRouter from "./routes/authRouter.js"
import chatRouter from "./routes/chatRouter.js"
import userRouter from "./routes/userRouter.js"
import messageRouter from "./routes/messageRouter.js"
import callRouter from "./routes/messageRouter.js"

app.use("/api/auth",authRouter)
app.use("/api/chat",chatRouter)
app.use("/api/user",userRouter)
app.use("/api/message",messageRouter)
app.use("/api/calls",callRouter)



export default app