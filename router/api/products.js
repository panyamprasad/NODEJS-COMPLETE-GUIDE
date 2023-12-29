const express = require("express");

const router = express.Router();

router.get("/product", (req, res, next) => {
  res.status(200).json({
    message: "Testing Routing",
  });
});

router.post("/", (req, res, next) => {
  const products = {
    name: req.body.name,
    price: req.body.price,
  };
  res.status(200).json({
    message: "Testing Routing post method",
    products: products,
  });
});
``;

router.post("/:id", (req, res, next) => {
  res.status(200).json({
    message: "Query params Routing post method",
    id: req.params.id,
  });
});

module.exports = router;
