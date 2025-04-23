const express = require("express");
const connectDB = require("./config/database");
const app = express();

const User = require("./models/user");
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

app.post("/signup", async (req, res) => {
  console.log("Started to insert user");
  const userObj = {
    firstName: "Naveen",
    lastName: "Srikaram",
    age: 24,
    emailId: "naveennavin5659@gmail.com",
    gender: "Male",
    password: "sample",
  };
  const userInstance = new User(userObj);
  try {
    await userInstance.save(); //returns a promise
    res.status(201).send({ message: "User record inserted successfully!" });
  } catch (err) {
    res.status(400).send({ message: "Something went wrong.." });
  }
});
