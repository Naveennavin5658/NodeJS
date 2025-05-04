const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(pass) {
        if (!validator.isStrongPassword(pass)) {
          throw new Error("Enter a strong password!");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 50,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female", "other"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url");
        }
      },
    },
    bio: {
      type: String,
      default: "Place holder of bio",
    },
    skills: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const jwtToken = jwt.sign({ _id: this._id }, "Random secret private Key", {
    expiresIn: "1d",
  });
  return jwtToken;
};
userSchema.methods.validatePassword = async function (passwordByUser) {
  const isPasswordValid = await bcrypt.compare(passwordByUser, this.password);
  return isPasswordValid;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
