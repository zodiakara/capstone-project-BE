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

reviewsRouter.put("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
reviewsRouter.delete("/:reviewId", async (req, res, next) => {
  try {
    const reviewToDelete = await ReviewsModel.findByIdAndDelete(
      req.params.reviewId
    );
    if (reviewToDelete) {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
