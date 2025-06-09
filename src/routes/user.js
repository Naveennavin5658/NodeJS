const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userData;
    const interestedRequests = await connectionRequest
      .find(
        {
          toUserId: loggedInUser._id,
          status: "interested",
        },
        {
          toUserId: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          status: 0,
        }
      )
      .populate("fromUserId", ["firstName", "lastName", "bio"]);
    res.status(200).json({
      message: "Data fetched successfully!",
      data: interestedRequests,
    });
  } catch (err) {
    res.status(400).json({
      message: `Failed to fetch user requests due to the error: ${err.message}`,
    });
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.userData;
    const connectionsList = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        status: "accepted",
      })
      .populate("fromUserId", ["firstName", "lastName", "bio"])
      .populate("toUserId", ["firstName", "lastName", "bio"]);

    const filteredRequests = connectionsList.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    return res.status(200).json({
      message: "Connections fetched successfully!",
      data: filteredRequests,
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Failed to fetch connections", reason: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  //Feed logic handling:
  // User should not see himself
  // Lets say there are 4 users A, B, C, D
  // A is logged in: Initial view: [B,C,D]
  // Lets say he requested to connect with B. Then: View: [C,D]
  // At this point, if B is logged in, his feed should also have view: [C,D] because A has sent a request, so he need not be in his feed
  // C can still have: {A,B,D}
  try {
    const loggedInUser = req.userData;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 1;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionRequests = await connectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });
    const hiddenUserProfiles = new Set();
    connectionRequests.forEach((req) => {
      hiddenUserProfiles.add(req.fromUserId);
      hiddenUserProfiles.add(req.toUserId);
    });
    const filteredFeedDocs = await User.find(
      {
        $and: [
          { _id: { $nin: Array.from(hiddenUserProfiles) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      },
      { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }
    )
      .skip(skip)
      .limit(limit);
    return res.status(200).json({
      message: "Feed api fetched data successfully!",
      data: filteredFeedDocs,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ message: `Feed API failed due to ${err.message}` });
  }
});

module.exports = userRouter;
