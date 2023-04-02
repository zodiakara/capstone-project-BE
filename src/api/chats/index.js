import express from "express";
import createHttpError from "http-errors";
import ChatsModel from "./model.js";

const chatsRouter = express.Router();

chatsRouter.get("/", async (req, res, next) => {
  try {
    const chats = await ChatsModel.find({});
    res.send(chats);
  } catch (error) {
    next(error);
  }
});

chatsRouter.post("/", async (req, res, next) => {
  try {
    const newChat = new ChatsModel(req.body);
    const { _id } = await newChat.save();
    res.status(200).send({ _id });
  } catch (error) {
    next(error);
  }
});

chatsRouter.get("/:chatId", async (req, res, next) => {
  try {
    const chat = await ChatsModel.findById(req.params.chatId);
    if (chat) {
      res.send(chat);
    } else {
      next(
        createHttpError(404, `Chat with id ${req.params.chatId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default chatsRouter;
