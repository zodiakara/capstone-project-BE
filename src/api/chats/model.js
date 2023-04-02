import mongoose, { Types } from "mongoose";
const { Schema, model } = mongoose;

const chatsSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Messages" }],
});

chatsSchema.methods.toJSON = function () {
  const chatDocument = this;

  const chat = chatDocument.toObject();

  delete chat.createdAt;
  delete chat.updatedAt;
  delete chat.__v;
  return chat;
};

export default model("Chat", chatsSchema);
