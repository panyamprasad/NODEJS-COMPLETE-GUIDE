const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

const bcrypt = require("bcrypt");
//@Register a User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All Fields are required...!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("Email address already taken...!");
  }

  //Hash Password
  const hashPassword = await bcrypt.hash(password, 10);
  console.log("Hash Password : ", hashPassword);
  //Create user
  const user = await User.create({
    username,
    email,
    password: hashPassword,
  });
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(404);
    throw new Error("Data not valid");
  }
});

//Login User API
const loginUser = asyncHandler(async (req, res) => {
  res.json({ message: "User login successfully..!" });
});

//Current User API
const currentUser = asyncHandler(async (req, res) => {
  res.json({ message: "Current user information..!" });
});

module.exports = { registerUser, loginUser, currentUser };
