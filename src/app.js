const express = require("express"); // we are importing a C library lol!

const app = express(); //we are creating an express JS app literally with a line of code!
//Order of routing matters a lot!!!
//app.use will match all http methods be it GET or POST or PUT or DELETE

app.use("/user", (req, res) => {
  //GET OR POST OR PUT OR DELETE
  //route handlers
  console.log("NAMASKARAM");
});

// One route can have multiple route handlers!!
// app.use("/endpoint",[routeHandler1,routeHandler2,routeHandler3,routeHandler4] using next param)
//this can even be app.use("/endpoint",[routeHandler1,routeHandler2],routeHandler3,routeHandler4 using next param)
app.use("/testuser", [
  (a, b, next) => {
    console.log("hi");
    next();
  },
  (a, b, next) => {
    console.log("Hello");
    next();
  },
  (a, b, next) => {
    console.log("Hello");
    next();
  },
  (a, b) => {
    console.log("Hello");
    b.send("Namste");
    // next();
  },
]);
app.listen(3000, () => {
  console.log("Successfully listening on port 3000...");
}); // we created a server and started to listen on port 3000
