import express from "express";
import createHttpError from "http-errors";
import { createAccessToken, createTokens } from "../../lib/auth/jwt-tools.js";
import { JWTAuthMiddleware } from "../../lib/auth/JWTmiddleware.js";
import UsersModel from "./model.js";
import ProductsModel from "../products/model.js";
import ReviewsModel from "../reviews/model.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const userRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      format: "jpeg",
      folder: "SWAPP/users",
      overwrite: true,
    },
  }),
}).single("avatar");

userRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

//get all users
userRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

//get single user data
userRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.user._id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

//get single user products

userRouter.get("/:userId/products", async (req, res, next) => {
  try {
    const user = req.params.userId;
    console.log(user);
    const products = await ProductsModel.find({ owner: user });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:userId", async (req, res, next) => {
  try {
    const modifiedUser = await UsersModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (modifiedUser) {
      res.send(modifiedUser);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByIdAndDelete(req.params.userId);
    if (user) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//login
userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.checkCredentials(email, password);
    console.log(user);
    if (user) {
      const { accessToken, refreshToken } = await createTokens(user);
      console.log(user);
      res.send({ accessToken, refreshToken });
    } else {
      next(createHttpError(404, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

//register:
userRouter.post("/register", async (req, res, next) => {
  try {
    //first email check
    const { email } = req.body;
    const user = await UsersModel.checkEmail(email);
    if (user) {
      next(createHttpError(409, `This email has already been used!`));
    } else {
      const newUser = new UsersModel(req.body);
      const { _id } = await newUser.save();
      const payload = { _id };
      const accessToken = await createAccessToken(payload);
      res.status(201).send({ accessToken });
    }
  } catch (error) {
    next(error);
  }
});

// multer upload avatar
userRouter.post(
  "/:userId/uploadAvatar",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const modifiedUser = await UsersModel.findByIdAndUpdate(
        req.params.userId,
        {
          avatar: req.file.path,
        },
        { runValidators: true, new: true }
      );

      if (modifiedUser) {
        res.send(modifiedUser);
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get("/:userId/userComments", async (req, res, next) => {
  const reviews = await ReviewsModel.find({
    receiver: req.params.userId,
  }).populate("commenter");
  res.send(reviews);
  try {
  } catch (error) {
    next(error);
  }
});
export default userRouter;
