import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    getter: { type: Schema.Types.ObjectId, ref: "User", required: false },
    adopted: { type: Boolean, required: true, default: false },
    description: { type: String, required: true },
    mainPicture: {
      type: String,
      required: false,
      default: "https://via.placeholder.com/400x400",
    },
    additionalPictures: { type: Array, required: false },
    category: {
      type: String,
      enum: ["Clothing", "Toys", "Household", "Garden", "Pets", "Other"],
      required: true,
    },
    condition: {
      type: String,
      enum: ["Used", "Slightly Used", "New"],
      required: false,
    },
    reviews: {
      userAdopting: { type: Boolean, required: false, default: false },
      userDonating: { type: Boolean, required: false, default: false },
    },
  },
  { timestamps: true }
);

export default model("Product", productsSchema);
