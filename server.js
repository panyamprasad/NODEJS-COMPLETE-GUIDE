// const http = require("http");

// const port = process.env.PORT || 3000;

// const app = require("./app");

// const server = http.createServer(app);

// server.listen(port, () => {
//   console.log("The Server is running 3000");
// });

const express = require("express");

//To show the error messages in json format we can create this middleware
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");

const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json({}));
app.use("/api/contacts", require("./router/api/contactRouter"));
app.use("/api/user", require("./router/api/userRouter"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
