import mongoose, { Error } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  mobile: {
    type: String,
    unique: true,
    sparse: true 
  },
  password: {
    type: String,
    required: true,
    select:false
  },
  refreshToken: {
    type: String,
    default: "",
    select:false
  },
  avatar: {
    type: String,
    default: "" 
  },
  bio: {
    type: String,
    maxlength: 160,
    default: ""
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  socketId: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "banned"],
    default: "active"
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }
}, { timestamps: true });


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
       return next();
    }

    this.password = await bcrypt.hash(this.password,10)

})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}



userSchema.methods.generateAccessToken = async function() {
    return jwt.sign({
        _id : this._id,
        email : this.email
    },process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn : process.env.ACCESS_TOKEN_EXPIRY
})
}

userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign({
        _id : this._id,
    },process.env.REFRESH_TOKEN_SECRET,
{
    expiresIn : process.env.REFRESH_TOKEN_EXPIRY
})
}

export const User = mongoose.model("User", userSchema)