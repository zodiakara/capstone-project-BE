import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    avatar: {
      type: String,
      required: false,
      default: "https://via.placeholder.com/200x200",
    },
    password: { type: String, required: false },
    refreshToken: { type: String, required: false },
  },
  { timestamps: true }
);

export default model("User", userSchema);
