import mongoose from "mongoose";
const { Schema, model } = mongoose;

const messagesSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    content: {
      text: { type: String, required: false },
      media: { type: String, required: false },
    },
  },
  { timestamps: true }
);

messagesSchema.methods.toJSON = function () {
  const messageDocument = this;

  const message = messageDocument.toObject();

  delete message.createdAt;
  delete message.updatedAt;
  delete message.__v;
  return message;
};

export default model("Message", messagesSchema);
