const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserOTPVerificationSchema = new Schema({
  userId: {
    type: String,

    required: true,
  },
  otp: {
    // Ensure this matches the name used in your code
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});
const UserOTPVerification = mongoose.model("UserOTPVerification", UserOTPVerificationSchema);
module.exports = UserOTPVerification;
