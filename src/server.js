import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import {
  badRequestHandler,
  conflictErrorHandler,
  forbiddenErrorHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js";
import userRouter from "./api/users/index.js";
import productRouter from "./api/products/index.js";
import reviewsRouter from "./api/reviews/index.js";
import createHttpError from "http-errors";
import { Server } from "socket.io";
import http from "http";
import { socketHandler } from "./lib/socket/index.js";
import chatsRouter from "./api/chats/index.js";
import messagesRouter from "./api/messages/index.js";
import dotenv from "dotenv";

dotenv.config();

const server = express();
const app = http.createServer(server);
const port = process.env.PORT;

const io = new Server(app, {
  transports: ["websocket"],
  origins: [
    process.env.FE_DEV_URL,
    process.env.FE_PROD_URL,
    process.env.FE_DEV_URL2,
  ],
});

io.on("connection", socketHandler);
io.on("error", (err) => {
  console.log(err);
});

// ************************* MIDDLEWARES **************************

const whitelist = [
  process.env.FE_DEV_URL,
  process.env.FE_PROD_URL,
  process.env.FE_DEV_URL2,
];
server.use(
  cors({
    origin: (origin, corsNext) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        corsNext(null, true);
      } else {
        corsNext(
          createHttpError(
            400,
            `Cors Error! Your origin ${origin} is not in the list!`
          )
        );
      }
    },
  })
);
server.use(express.json());
// ************************* ENDPOINTS ****************************

server.use("/users", userRouter);
server.use("/products", productRouter);
server.use("/reviews", reviewsRouter);
server.use("/chats", chatsRouter);
server.use("/messages", messagesRouter);

// ************************* ERROR HANDLERS ***********************

server.use(badRequestHandler);
server.use(unauthorizedErrorHandler);
server.use(notFoundHandler);
server.use(forbiddenErrorHandler);
server.use(conflictErrorHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("connected to Mongo!");
  app.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`server is running on port ${port}`);
  });
});
