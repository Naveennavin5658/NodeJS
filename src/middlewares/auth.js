const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    //Read the token from req cookies, validate token, find if the user is valid
    const cookiesData = req.cookies;
    const { token } = cookiesData;
    if (!token) {
      throw new Error("Token is not valid!");
    }
    const decodedObj = jwt.verify(token, "Random secret private Key");
    const { _id } = decodedObj;
    const loggedUser = await User.findById(_id);
    if (loggedUser) {
      req.userData = loggedUser;
      next();
    } else {
      throw new Error("User is not found in db");
    }
  } catch (err) {
    res.status(401).send("Invalid user!!!", err.message);
  }
};
module.exports = {
  userAuth,
};
//mongodb+srv://Naveen:Naveen@cluster0.h5lqydk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
