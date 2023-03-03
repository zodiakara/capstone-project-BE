import mongoose from "mongoose";
const { Schema, model } = mongoose;

const reviewsSchema = new Schema(
  {
    commenter: { type: Schema.Types.ObjectId, ref: "User" },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    content: {
      text: { type: String, required: true },
      rating: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
    },
  },
  { timestamps: true }
);

export default model("Review", reviewsSchema);
