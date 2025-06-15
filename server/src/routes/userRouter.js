import { Router } from "express";
import { changeUserPassword, getUserProfile, getUsers, updateUserEmail, updateUserMobile, updateUserProfile } from "../controllers/user.js";
import { authMiddleware } from "../middleware/userAuthMiddleware.js";
import { multerErrorHandler, upload } from "../middleware/multerMiddleware.js";

const router =  Router()

router.route("/").get(authMiddleware,getUsers)
router.route("/profile").get(authMiddleware,getUserProfile)
router.route("/update-profile").patch(authMiddleware,upload.single("avatar"),multerErrorHandler,updateUserProfile)
router.route("/update-email").patch(authMiddleware,updateUserEmail)
router.route("/change-password").patch(authMiddleware,changeUserPassword)
router.route("/update-mobile").patch( authMiddleware, updateUserMobile);

export default router