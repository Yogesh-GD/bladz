import { Router } from "express";
import { authMiddleware } from "../middleware/userAuthMiddleware.js";
import { deleteMessage, getMessages, markMessagesAsSeen, sendMessage } from "../controllers/message.js";
import { multerErrorHandler, upload } from "../middleware/multerMiddleware.js";

const router =  Router()

router.route("/send").post(authMiddleware,upload.single("file"),multerErrorHandler,sendMessage)

router.route("/:chatId").get(authMiddleware,getMessages)

router.route("/seen").patch(authMiddleware,markMessagesAsSeen)

router.route("/:messageId").delete(authMiddleware,deleteMessage)




export default router