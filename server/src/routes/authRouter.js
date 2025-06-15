import { Router } from "express";
import { logoutUser, refreshUserAccessToken, registerUser, UserLogin } from "../controllers/user.js";


const router = Router()

router.route("/user/register").post(registerUser)
router.route("/user/login").post(UserLogin)
router.route("/user/logout").delete(logoutUser)

router.route("/user/refresh-token").post(refreshUserAccessToken)







export default router