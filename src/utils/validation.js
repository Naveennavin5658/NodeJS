const validator = require("validator");
const validateSingupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First Name constraints not matched");
  } else if (lastName.length < 4 || lastName.length > 50) {
    throw new Error("Last Name constraints not matched");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password!!!!");
  }
};
module.exports = validateSingupData;
