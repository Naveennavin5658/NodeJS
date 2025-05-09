const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestsRouter = express.Router();

//Register a user
requestsRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.body;

    console.log("Sending a connection request...");
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

module.exports = requestsRouter;
