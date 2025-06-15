import { Router } from "express";
import { accessChat, addUserToGroup, createGroupChat, deleteChat, getAllChats, getSingleChat, leaveGroupChat, removeUserFromGroup } from "../controllers/chat.js";
import { authMiddleware } from "../middleware/userAuthMiddleware.js";
import { multerErrorHandler, upload } from "../middleware/multerMiddleware.js";

const router =  Router()

router.route("/access-chat").post(authMiddleware,accessChat)
router.route("/new-group").post(authMiddleware,upload.single('groupImage'),multerErrorHandler,createGroupChat)
router.route("/").get(authMiddleware,getAllChats)
router.route("/single-chat/:chatId").get(authMiddleware,getSingleChat)
router.route("/:chatId").delete(authMiddleware,deleteChat)
router.route("/:chatId/leave").patch(authMiddleware,leaveGroupChat)
router.route("/:chatId/add-members").post(authMiddleware,addUserToGroup)
router.route("/:chatId/remove-member").patch(authMiddleware,removeUserFromGroup)



export default router