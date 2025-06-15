import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";



export const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
      const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  
      if (!token) {
      throw  new ApiError(401, "Unauthorized Request. No token provided.");
      }
  
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      
      if (!decodedToken?._id) {
      throw new ApiError(403, "Invalid access token.");
      }
  
      const user = await User.findById(decodedToken._id).select("-password -refreshToken");
  
      if (!user) {
       throw new ApiError(403, "User not found. Invalid token.");
      }
  
      req.user = user;
      next();
  
    } catch (error) {
       throw new ApiError(401, error?.message || "Invalid access token.");
    }
  });