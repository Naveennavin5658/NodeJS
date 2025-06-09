const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestsRouter = express.Router();

//Register a user
requestsRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.userData._id.toString();
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Connection status not allowed!");
    }
    if (fromUserId === toUserId) {
      res
        .status(400)
        .json({ message: "User cant send request to himself/herself!" });
    }
    //Check if the toUser exists in db
    const toUserData = await User.findById(toUserId);
    if (!toUserData) {
      res.status(400).send({ message: "To User doesn't exists! Bad Data!" });
    }
    //Check if exisiting connection request for fromUserId to toUserId
    const exisitngRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: toUserId }, { toUserId: fromUserId }],
    });
    if (exisitngRequest.length != 0) {
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

requestsRouter.post(
  "/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.userData;
      //Validate the user
      //Padmaja => HumbleFool5659
      // Check if loggedIn user is HumbleFool5659 or not (Receiver person is the loggedIn person)
      // Check if the status is interested
      // Request Id should be the valid one
      const allowedStatus = ["accepted", "rejected"];
      const { status, requestId } = req.params;
      if (!allowedStatus.includes(status)) {
        res.status(400).json({ message: "Status is not valid" });
      }
      const connReqObj = await ConnectionRequest.findOne({
        _id: requestId,
        status: "interested",
        toUserId: loggedInUser._id,
      })
      if (connReqObj === null) {
        return res
          .status(404)
          .json({ message: "Connection Request not found!" });
      }
      connReqObj.status = status;
      await connReqObj.save();
      return res
        .status(200)
        .json({ message: `Connection Request status ${status}!` });
    } catch (err) {
      console.error("Error:", err); // Better error log
      return res
        .status(400)
        .json({ message: "Request failed", error: err.message });
    }
  }
);

module.exports = requestsRouter;
