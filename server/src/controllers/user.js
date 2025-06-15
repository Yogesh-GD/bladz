import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
 

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if ([username, email, password].some((value) => value?.trim() === "")) {
        throw new ApiError(400, "Fields are required.")
    }
    if (password.length < 9) {
        throw new ApiError(400, "password must be 8 characaters long.")
    }

    const isUserAlreadyExistByUsername = await User.findOne({ username })
    const isUserAlreadyExistByEmail = await User.findOne({ email })

    if (isUserAlreadyExistByUsername) {
        throw new ApiError(409, "UserName already exists.")
    }

    if (isUserAlreadyExistByEmail) {
        throw new ApiError(409, "Email already exists.")
    }

    const newUser = await User.create({
        username,
        email,
        password
    })

    return res.status(200).json(new ApiResponse(200, {}, "Successfully user registered."))

})

export const refreshUserAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];
    if (!refreshToken) {
        throw new ApiError(403, "Unauthorized Request, No token provided.")
    }

    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedRefreshToken._id).select(" +refreshToken")
    if (!user) {
        throw new ApiError(403, "invalid refresh token, User not found")
    }

    const userRefreshToken = user.refreshToken
    if (refreshToken !== userRefreshToken) {
        throw new ApiError(403, "invalid refresh token.")
    }
    const newRefreshToken = await user.generateRefreshToken();
    const newAccessToken = await user.generateAccessToken();
    user.refreshToken = newRefreshToken
    await user.save({ validateBeforeSave: false })
    res.status(200)
        .cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 1000,
        })
        .cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json(new ApiResponse(200, { newRefreshToken, newAccessToken }, "success"))


})


export const UserLogin = asyncHandler(async (req, res) => {
    const { usernameOrEmail, password } = req.body

 
    const user = await User.findOne({
        $or:[{email:usernameOrEmail},{username:usernameOrEmail}]
    }).select("+password")

    if(!user){
        throw new ApiError(404,"User not found.")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new ApiError(404,"passowrd is incorrect.")
    }

    const refreshToken = await user.generateRefreshToken()
    const accessToken = await user.generateAccessToken()

    user.refreshToken = refreshToken
    user.save()

    res.cookie('accessToken',accessToken,{
        httpOnly:true,
        secure:true,
        sameSite:'strict',
        maxAge:60*1000
    })
    res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:'strict',
        maxAge:7*24*60*60*1000
    })

    return res.status(200).json( new ApiResponse(200,{accessToken,refreshToken},"Successfully user login."))
})

export const logoutUser = asyncHandler( async (req,res) => {
    const token = req.cookies?.refreshToken || req.headers.authorization?.replace("Bearer ", "");
    if (token) {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        await User.findByIdAndUpdate(decoded._id, { $set: { refreshToken: "" } }, { new: true });

    }

    res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200,{},"successfully user logged out."))
})

export const changeUserPassword = asyncHandler( async (req,res) => {
    const { currentPassword,newPassword } = req.body

    const user_id = req.user._id

    if(currentPassword == newPassword){
        throw new ApiError(400,"Given passwords both can't be same.")
    }

    if(newPassword.length < 9){
        throw new ApiError(400,"password must be long 8 character's or more.")
    }
    const user = await User.findById(user_id).select("+password")

    const iscurrentPasswordCorrect = await await user.isPasswordCorrect(currentPassword)

    if(!iscurrentPasswordCorrect){
        throw new ApiError(401,"current password is incorrect")
    }

    const isNewPasswordSameAsOld = await await user.isPasswordCorrect(newPassword)
    
    if(isNewPasswordSameAsOld){
        throw new ApiError(401,"New password must not be same as current password.")
    }

    user.password = newPassword

    await user.save()

    res.status(200).json(new ApiResponse(200,{},"password successfully changed."))
} )


export const getUserProfile = asyncHandler( async (req,res) => {

    if(!req.user._id){
        throw new ApiError(400,"no user id provided.")
    }
    
    const profile  = await User.findById(req.user._id)

    if(!profile){
        throw new ApiError(404,"User not found.")
    }
    res.status(200).json(new ApiResponse(200,profile,"successfully user profile fetched."))
})


export const getUsers = asyncHandler(async (req,res) => {
    const { search = '', sortBy = 'username', order = 'asc'} = req.query;
    const currentUserId = req.user._id;
    const page = parseInt(req.query.page,10) || 1
    const limit = parseInt(req.query.limit,10) || 10
    const sortOrder = order === 'desc' ? -1 : 1;
    const query = {
      _id: { $ne: currentUserId },
      $or: [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: Number(search), $options: 'i' } },
      ]
    };


    const users = await User.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('username email mobile avatar isOnline');

    const totalUsers = await User.countDocuments(query);

    const data = {
      success: true,
      users,
      totalUsers,
      currentPage: page,
      pages: Math.ceil(totalUsers / limit)
    }
    res.status(200).json(new ApiResponse(200,data,"Successfully user list fetched."));
})


export const updateUserProfile = asyncHandler(async (req,res) => {
    const { username,bio } = req.body
    const userId = req.user._id

    const isOtherUserExistsWithUsername = await User.find({username,_id : {$ne : userId}})
    if(isOtherUserExistsWithUsername.length > 0){
        throw new ApiError(400,"Already user exists with this user name.")
    }

    const newData = {
        username,bio
    }
    if(req.file){
        newData.avatar = req.file.path
    }

    const updatedUser = await User.findByIdAndUpdate(userId,newData,{new:true})

    
    res.status(200).json(new ApiResponse(200,updatedUser,"Successfully user profile updated."))
})

export const updateUserEmail = asyncHandler(async (req,res) => {
    const {email} = req.body
    const userId = req.user._id
    const isOtherUserExistsWithUsername = await User.find({email,_id : {$ne : userId}})
    if(isOtherUserExistsWithUsername.length > 0){
        throw new ApiError(400,"Already user exists with this email.")
    }

  const updatedUser = await User.findByIdAndUpdate(userId,{email},{new:true})

    
 res.status(200).json(new ApiResponse(200,updatedUser,"Successfully user email updated."))
})


export const updateUserMobile = asyncHandler(async (req, res) => {
  const { mobile } = req.body;
  const userId = req.user._id;

  if (!mobile) {
    throw new ApiError(400, "Mobile number is required.");
  }

  const mobileRegex = /^[0-9]{10,15}$/;
  if (!mobileRegex.test(mobile)) {
    throw new ApiError(400, "Please enter a valid mobile number.");
  }

  const existingUser = await User.findOne({ mobile, _id: { $ne: userId } });
  if (existingUser) {
    throw new ApiError(400, "Another user already exists with this mobile number.");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { mobile },
    { new: true }
  );

  res.status(200).json(
    new ApiResponse(200, updatedUser, "Successfully updated mobile number.")
  );
});