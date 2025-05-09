const express = require("express");

const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const validateSingupData = require("../utils/validation");
//Register a user
authRouter.post("/signup", async (req, res) => {
  try {
    //Validation of data
    validateSingupData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //Encrypt the user password
    const passwordHash = await bcrypt.hash(password, 10);

    const userInstance = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await userInstance.save(); //returns a promise
    res.status(201).send({ message: "User record inserted successfully!" });
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

//Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).send({ message: "User login successful!!" });
    } else {
      throw new Error("Entered password is not correct..");
    }
  } catch (err) {
    res.status(400).send({ message: err.message || err.toString() });
  }
});
module.exports = authRouter;
