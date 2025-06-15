import { useEffect } from "react"
import { socket } from "../socket";


export const useChatSocket = (chatId, eventHandlers = {}) => {
    useEffect(() => {
        if(!chatId) return;
        
        socket.emit("join chat",chatId)

        for (const [eventName,handler] of Object.entries(eventHandlers)) {
            socket.on(eventName,handler)
        }

        return () => {
            socket.emit("leave chat",chatId)

            for(const [eventName,handler] of Object.entries(eventHandlers)){
                socket.off(eventName,handler)
            }
        }
    },[chatId,JSON.stringify(Object.keys(eventHandlers))])
}