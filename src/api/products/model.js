import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Clothing", "Kids Clothing", "Toys", "Household", "Other"],
      required: true,
    },
    condition: {
      type: String,
      enum: ["Used", "Slightly Used", "New"],
      required: false,
    },
  },
  { timestamps: true }
);

export default model("Product", productsSchema);
