import express from "express";
import createHttpError from "http-errors";
import MessagesModel from "./model.js";
import { JWTAuthMiddleware } from "../../lib/auth/JWTmiddleware.js";

const messagesRouter = express.Router();

messagesRouter.get("/", async (req, res, next) => {
  try {
    const messages = await MessagesModel.find({});
    res.send(messages);
  } catch (error) {
    next(error);
  }
});

messagesRouter.get(
  "/user/:receiverId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    //get all messages between two users and return them, make sure to only get the messages that are between ONLY the two users
    //get the sender and receiver id from the req.params
    //get the sender and receiver id from the req.user
    //get all messages between the two users
    //return the messages
    try {
      const messages = await MessagesModel.find({
        $or: [
          {
            $and: [
              { sender: req.user._id },
              { receiver: req.params.receiverId },
            ],
          },
          {
            $and: [
              { sender: req.params.receiverId },
              { receiver: req.user._id },
            ],
          },
        ],
      }).populate("sender receiver");
      res.send(messages);
    } catch (error) {
      next(error);
    }
  }
);

messagesRouter.post("/", async (req, res, next) => {
  try {
    const newMessage = new MessagesModel(req.body);
    const { _id } = await newMessage.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

messagesRouter.get("/:messageId", async (req, res, next) => {
  try {
    const message = await MessagesModel.findById(req.params.messageId);
    if (message) {
      res.send(message);
    } else {
      next(
        createHttpError(
          404,
          `Message with id ${req.params.messageId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

messagesRouter.put("/:messageId", async (req, res, next) => {
  try {
    const updatedMessage = await MessagesModel.findByIdAndUpdate(
      req.params.messageId,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (updatedMessage) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Message with id ${req.params.messageId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

messagesRouter.delete("/:messageId", async (req, res, next) => {
  try {
    const deletedMessage = await MessagesModel.findByIdAndDelete(
      req.params.messageId
    );

    if (deletedMessage) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Message with id ${req.params.messageId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default messagesRouter;
