const adminAuth = (req, res, next) => {
  const token = "naveen";
  console.log("Admin auth implemented..");
  if (token === "naveen") {
    next();
  } else {
    res.status(401).send("Not authorised");
  }
};
module.exports = {
  adminAuth,
};
