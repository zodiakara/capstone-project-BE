import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, enum: ["Used", "New"], required: false },
  },
  { timestamps: true }
);

export default model("Product", productsSchema);
