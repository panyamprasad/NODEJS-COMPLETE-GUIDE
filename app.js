const express = require("express");

const morgan = require("morgan");

const bodyParse = require("body-parser");

const app = express();

const productsRouter = require("./router/api/products");

app.use(morgan("dev"));

app.use(bodyParse.urlencoded({ extended: false }));

app.use(bodyParse.json({}));

app.use("/products", productsRouter);

app.use((req, res, next) => {
  const error = new Error("Page Not Found...");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
