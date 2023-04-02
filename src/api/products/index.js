import express from "express";
import createHttpError from "http-errors";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import ProductsModel from "./model.js";
import q2m from "query-to-mongo";

const productRouter = express.Router();

const cloudinaryUploaderSingle = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      format: "jpeg",
      folder: "SWAPP/products",
    },
  }),
}).single("mainPicture");

const cloudinaryUploaderMultiple = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      format: "jpeg",
      folder: "SWAPP/productsAdd",
    },
  }),
}).array("additionalPictures");

productRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductsModel(req.body);
    const { _id } = await newProduct.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductsModel.find().populate("owner");
    if (products) {
      res.send(products);
    } else {
      next(createHttpError(404, "no products found in the database"));
    }
  } catch (error) {
    next(error);
  }
});
productRouter.get("/search/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const products = await ProductsModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    ).populate("owner");
    if (products) {
      res.send(products);
    } else {
      next(createHttpError(404, "no products found in the database"));
    }
  } catch (error) {
    next(error);
  }
});

productRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId).populate(
      "owner"
    );
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productRouter.put("/:productId", async (req, res, next) => {
  try {
    const modifiedProduct = await ProductsModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (modifiedProduct) {
      res.send(modifiedProduct);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productRouter.delete("/:productId", async (req, res, next) => {
  try {
    const deletedProduct = await ProductsModel.findByIdAndDelete(
      req.params.productId
    );
    if (deletedProduct) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

//multer upload single
productRouter.post(
  "/:productId/files",
  cloudinaryUploaderSingle,
  async (req, res, next) => {
    try {
      console.log(req.file.path);
      const modifiedProduct = await ProductsModel.findByIdAndUpdate(
        req.params.productId,
        {
          mainPicture: req.file.path,
        },
        { runValidators: true, new: true }
      );
      if (modifiedProduct) {
        res.send(modifiedProduct);
      } else {
        next(
          createHttpError(
            404,
            `Product with id ${req.params.productId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);
productRouter.post(
  "/:productId/filesAdditional",
  cloudinaryUploaderMultiple,
  async (req, res, next) => {
    try {
      const modifiedProduct = await ProductsModel.findByIdAndUpdate(
        req.params.productId,
        {
          additionalPictures: req.files,
        },
        { runValidators: true, new: true }
      );
      if (modifiedProduct) {
        res.send(modifiedProduct);
      } else {
        next(
          createHttpError(
            404,
            `Product with id ${req.params.productId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default productRouter;
