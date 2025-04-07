const express = require("express"); // we are importing a C library lol!

const app = express(); //we are creating an express JS app literally with a line of code!

app.use("/health-check", (req, res) => {
  res.send("Health check route passed...");
});

app.use("/health-check-test2", (req, res) => {
  res.send("Health check route path 2 passed...");
});

app.use((req, res) => {
  res.send("Anonymus route passed...");
});

app.listen(3000, () => {
  console.log("Successfully listening on port 3000...");
}); // we created a server and started to listen on port 3000
