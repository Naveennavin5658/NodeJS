const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const connectDB = require("./config/database");
const app = express();

const User = require("./models/user");
const validateUserUpdateFields = require("./middlewares/validateUpdateFields");
const validateSingupData = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
//Register a user
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid credentials");
    }
    const userData = await User.findOne({ emailId: emailId });
    if (!userData) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, userData?.password);
    if (isPasswordValid) {
      const token = jwt.sign(
        { _id: userData._id },
        "Random secret private Key",
        { expiresIn: "1d" }
      );
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000 ),
      });
      res.status(200).send({ message: "User login successful!!" });
    } else {
      throw new Error("Entered password is not correct..");
    }
  } catch (err) {
    res.status(400).send({ message: err.message || err.toString() });
  }
});

//Sample profile API
app.get("/profile", userAuth, async (req, res) => {
  try {
    const userData = req.userData;
    res.status(200).send({ message: userData });
  } catch (e) {
    res.status(400).send({ message: e });
  }
});

// Get user by email
app.get("/get-user", userAuth, async (req, res) => {
  email = req.body.email;
  //#!TODO: Make sure email remains unique
  try {
    const dbResp = await User.find({ emailId: email });
    if (dbResp.length < 1) {
      res.status(404).send({ message: "User not found" });
    } else {
      res.status(200).send({ message: dbResp });
    }
  } catch (e) {
    res.status(400).send({ message: e });
  }
});

//Feed the user
app.get("/feed", userAuth, async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).send({ message: allUsers });
  } catch (err) {
    res.status(400).send({ message: e });
  }
});
const allowedUserUpdates = [
  "photoUrl",
  "bio",
  "gender",
  "age",
  "skills",
  "email",
];

//Update data of the user
app.patch(
  "/user/:userId",
  userAuth,
  validateUserUpdateFields(allowedUserUpdates),
  async (req, res) => {
    const userRequest = req.body;
    const userId = req.params?.userId;
    try {
      const dbResponse = await User.findOneAndUpdate(
        { _id: userId },
        userRequest,

        { returnDocument: "before", runValidators: true }
      );

      res.status(200).send("Update success");
    } catch (err) {
      res.status(404).send({ message: err });
    }
  }
);

//Delete a user
app.delete("/user", userAuth, async (req, res) => {
  try {
    const mongoId = req.body.userId;
    const delResp = await User.findByIdAndDelete({ _id: mongoId });

    res.status(200).send({ message: "User Deleted Successfully" });
  } catch (e) {
    res.status(400).send({ message: e });
  }
});

// Health check locally & DB Connection check
connectDB()
  .then(() => {
    console.log("DB connection successful");
    app.listen(3000, () => {
      console.log("Successfully listening on port 3000...");
    }); //ensuring server helath check after db connection
  })
  .catch((err) => {
    console.log("DB Connection failed due to error ", err);
  });
