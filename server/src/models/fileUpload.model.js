import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileUrl:    { type: String, required: true },
  fileType:   { type: String }, 
  relatedMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
}, { timestamps: true });

export const FileUpload = mongoose.model("FileUpload", fileSchema);
