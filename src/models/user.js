const mongoose = require("mongoose");
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
        if (!email.includes("@") || !email.includes(".com")) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 20,
      trim: true,
      validate(pass) {
        const resp = /^[a-z0-9]+$/i.test(pass);
        if (!resp) {
          throw new Error("Password must be alphanumeric!");
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

const User = mongoose.model("User", userSchema);
module.exports = User;
