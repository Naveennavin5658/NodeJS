const express = require("express");

const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
//Sample profile API
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const userData = req.userData;
    res.status(200).send({ message: userData });
  } catch (e) {
    res.status(400).send({ message: e });
  }
});

module.exports = profileRouter;
