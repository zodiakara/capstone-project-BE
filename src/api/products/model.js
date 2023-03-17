import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    adopted: { type: Boolean, required: true, default: false },
    mainPicture: {
      type: String,
      required: false,
      default: "https://via.placeholder.com/400x400",
    },
    additionalPictures: { type: Array, required: false },
    category: {
      type: String,
      enum: [
        "Clothing",
        "Kids Clothing",
        "Toys",
        "Household",
        "Electronics",
        "Garden",
        "Pets",
        "Other",
      ],
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
