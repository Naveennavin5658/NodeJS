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

const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "bio",
    "age",
    "gender",
    "skills",
  ];
  console.log("Inside validating user edit.....", Object.keys(req.body));
  let editAllowed = true;

  for (const field of Object.keys(req.body)) {
    if (!allowedEditFields.includes(field)) {
      editAllowed = false;
      break;
    }
  }
  if (editAllowed) {
    console.log("Editing is allowed..");
    return true;
  } else {
    console.log("Edit fucked up!");
    return false;
  }
};
module.exports = { validateSingupData, validateProfileEditData };
