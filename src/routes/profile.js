const express = require("express");

const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const {
  validateProfileEditData,
  validateOldAndNewPasswords,
} = require("../utils/validation");
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

//Update Password
profileRouter.patch("/profile/update-password", userAuth, async (req, res) => {
  try {
    const loggedInUserDetails = req.userData;
    console.log("We have the user details on server details...");
    if (
      req.body.existingPassword === null ||
      req.body.existingPassword === ""
    ) {
      throw new Error("Existing password cannot be null or empty string");
    }
    const updateBoolean = await validateOldAndNewPasswords(req);

    if (!updateBoolean) {
      throw new Error(
        "Either user entered password is not matched or new password is not strong!"
      );
    }

    loggedInUserDetails.password = await bcrypt.hash(req.body.newPassword, 10);
    await loggedInUserDetails.save();
    res.status(200).send({ message: "Password update successful" });
  } catch (e) {
    res.status(400).send({ message: "Update password failed as " + e });
  }
});

module.exports = profileRouter;
