import express from "express";
import createHttpError from "http-errors";
import ReviewsModel from "./model.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const newReview = new ReviewsModel(req.body);
    const { _id } = await newReview.save();
    res.send({ _id });
  } catch (error) {
    next(error);
  }
});
reviewsRouter.get("/", async (req, res, next) => {
  try {
    const reviews = await ReviewsModel.find();
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});
// reviewsRouter.get("/userComments/:userId", async (req, res, next) => {
//   const reviews = ReviewsModel.find({ receiver: req.params.userId }).populate(
//     "commenter"
//   );
//   res.send(reviews);
//   try {
//   } catch (error) {
//     next(error);
//   }
// });
reviewsRouter.put("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
reviewsRouter.delete("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
