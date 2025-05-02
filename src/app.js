const express = require("express");
const connectDB = require("./config/database");
const app = express();

const User = require("./models/user");

app.use(express.json());
//Register a user
app.post("/signup", async (req, res) => {
  user_payload = req.body;

  const userInstance = new User(user_payload);
  try {
    await userInstance.save(); //returns a promise
    res.status(201).send({ message: "User record inserted successfully!" });
  } catch (err) {
    res.status(400).send({ message: "Something went wrong.." });
  }
});

// Get user by email
app.get("/get-user", async (req, res) => {
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
    res.status(400).send({ message: "dbResp" });
  }
});

//Feed the user
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).send({ message: allUsers });
  } catch {
    res.status(400).send({ message: "dbResp" });
  }
});

//Update data of the user
app.patch("/user", async (req, res) => {
  try {
    const userRequest = req.body;
    console.log(userRequest);
    const dbResponse = await User.findOneAndUpdate(
      { _id: userRequest._id },
      userRequest,
      {
        returnDocument: "before",
      }
    );
    console.log("Befoore update", dbResponse);
    res.status(200).send("Update success");
  } catch {
    res.status(404).send("Update user failed!");
  }
});

//Delete a user
app.delete("/user", async (req, res) => {
  try {
    const mongoId = req.body.userId;
    const delResp = await User.findByIdAndDelete({ _id: mongoId });

    console.log("Deleted Response: ", delResp);
    res.status(200).send({ message: "User Deleted Successfully" });
  } catch {
    res.status(400).send({ message: "Delete Operation failed" });
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
