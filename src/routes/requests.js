const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const requestsRouter = express.Router();

//Register a user
requestsRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.userData._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["ignored", "interested"];
    if (!status.includes(allowedStatus)) {
      throw new Error("Connection status not allowed!");
    }
    if (fromUserId === toUserId) {
      res
        .status(400)
        .json({ message: "User cant send request to himself/herself!" });
    }
    //Check if the toUser exists in db
    const toUserData = await ConnectionRequest.findById(toUserId);
    if (!toUserData) {
      res.status(400).send({ message: "To User doesn't exists! Bad Data!" });
    }
    //Check if exisiting connection request for fromUserId to toUserId
    const exisitngRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: toUserId }, { toUserId: fromUserId }],
    });
    if (exisitngRequest) {
      res.status(400).json({ message: "Connection already sent" });
    }

    const connecReq = new ConnectionRequest({ fromUserId, toUserId, status });
    const data = await connecReq.save();

    res.json({ message: "Connection request handled!", data });
  } catch (err) {
    console.error("Error:", err); // Better error log
    res.status(400).send({ message: "Request failed", error: err.message });
  }
});

module.exports = requestsRouter;
