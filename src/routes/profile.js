const express = require("express");

const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
//Sample profile API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const userData = req.userData;
    res.status(200).send({ message: userData });
  } catch (e) {
    res.status(400).send({ message: e });
  }
});

//Profile edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isEditAllowed = validateProfileEditData(req);
    if (!isEditAllowed) {
      throw new Error("Invalid edit request!");
    }
    const loggedInUser = req.userData;
    console.log("USER DATA CHECK", loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.send({ message: "Profile updated sucessfully!", data: loggedInUser });
  } catch (e) {
    res.status(400).send({ message: e });
  }
});

module.exports = profileRouter;
