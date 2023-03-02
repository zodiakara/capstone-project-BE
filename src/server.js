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

const server = express();
const port = process.env.PORT;

// ************************* MIDDLEWARES **************************

server.use(express.json());
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];
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

// ************************* ENDPOINTS ****************************

server.use("/users", userRouter);
server.use("/products", productRouter);

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
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`server is running on port ${port}`);
  });
});
