import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    campus: { type: String, enum: ["Malabe", "Metro"], default: "Malabe" },
    isVerified: { type: Boolean, default: false },
    verifyToken: String,
    verifyTokenExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);