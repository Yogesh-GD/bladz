import app from "./src/app.js"
import connectdb from "./src/config/db.js"
import { socketInit } from "./src/socket/server.js"
import http from "http"

const port = process.env.PORT || 5000


connectdb()

const server = http.createServer(app)

socketInit(server)



server.listen(port,"0.0.0.0",() => {
    console.log(`server is running on port ${ port }`)
} )