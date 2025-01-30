const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    nickName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: function (value) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
        },
        message: "Invalid email",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 20,
      validate: {
        validator: function (value) {
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,20}$/.test(
            value
          );
        },
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
      },
    },
    profileImage: { type: String, required: false }, // Image URL
  },
  { timestamps: true }
);

// Pre-save middleware to hash passwords
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to validate password
userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Auto-delete profile image when user is removed
userSchema.pre("remove", async function (next) {
  if (this.profileImage) {
    try {
      // Extract filename from the URL
      const imageFilename = this.profileImage.split("/").pop();
      const imagePath = path.join(
        __dirname,
        "../../profileImgs",
        imageFilename
      );

      // Check if file exists before deleting
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting profile image:", err);
          else console.log("Profile image deleted:", imagePath);
        });
      }
    } catch (error) {
      console.error("Error handling profile image deletion:", error);
    }
  }
  next();
});

// Post-save middleware for unique constraint errors
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Duplicate field value found."));
  } else {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
