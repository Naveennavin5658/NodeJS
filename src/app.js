const express = require("express"); // we are importing a C library lol!

const app = express(); //we are creating an express JS app literally with a line of code!
//Order of routing matters a lot!!!
//app.use will match all http methods be it GET or POST or PUT or DELETE
app.use("/health-check/3", (req, res) => {
  res.send("Health check route 3 passed...");
});

app.use("/health-check", (req, res) => {
  res.send("Health check route passed...");
});

app.use("/health-check-test2", (req, res) => {
  res.send("Health check route path 2 passed...");
});

// app.use((req, res) => {
//   res.send("Anonymus route passed...");
// });

//First GET Request
app.get("/users", (req, res) => {
  console.log("Fetching all users idiot");
  res.send("Sending all users details, wait you idiot");
});

app.listen(3000, () => {
  console.log("Successfully listening on port 3000...");
}); // we created a server and started to listen on port 3000
