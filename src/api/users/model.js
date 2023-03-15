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
    birthDate: { type: Date, required: false },
    gender: { type: String, required: false, enum: ["Female", "Male"] },
    address: {
      street: { type: String, required: false },
      number: { type: Number, required: false },
      City: { type: String, required: false },
      ZIP: { type: String, required: false },
    },
    bio: { type: String, required: false },
    password: { type: String, required: false },
    refreshToken: { type: String, required: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const currentUser = this;
  if (currentUser.isModified("password")) {
    const plainPW = currentUser.password;
    const hash = await bcrypt.hash(plainPW, 10);
    currentUser.password = hash;
  }
  next();
});
userSchema.methods.toJSON = function () {
  const userDocument = this;
  const user = userDocument.toObject();

  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.__v;
  delete user.refreshToken;

  return user;
};

userSchema.static("checkCredentials", async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (passwordCheck) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

userSchema.static("checkEmail", async function (email) {
  const user = await this.findOne({ email });
  if (user) {
    return email;
  } else {
    return null;
  }
});

export default model("User", userSchema);
