const express = require("express");
const connectDB = require("./config/database");
const app = express();

const User = require("./models/user");

app.use(express.json());

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
