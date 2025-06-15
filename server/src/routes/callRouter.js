import { Router } from "express";
import { authMiddleware } from "../middleware/userAuthMiddleware.js";
import {
  initiateCall,
  updateCallStatus,
  getCallDetails,
  cancelCall,
  getCallHistory
} from "../controllers/callController.js";

const router = Router();

router.route("/initiate").post(authMiddleware, initiateCall);

router.route("/update-status").post(authMiddleware, updateCallStatus);

router.route("/cancel").post(authMiddleware, cancelCall);

router.route("/:callId").get(authMiddleware, getCallDetails);

router.route("/history").get(authMiddleware, getCallHistory);

export default router;
