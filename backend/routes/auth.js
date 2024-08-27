const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult, Result } = require("express-validator");
//for password encryption
const bcrypt = require("bcryptjs");

//for genereating verification token
const jwt = require("jsonwebtoken");
// JWT_secret is written here because multiple rotue may need  it
const JWT_SECRET = "SOME_RANDOM_SEQURE_STUFF";

var fetchuser = require("../middleware/fetchuser");
const UserOTPVerification = require("../models/UserOTPVerification");
const nodemailer = require("nodemailer");
require("dotenv").config();

console.log(process.env.APP_PASS);
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASS,
  },
});

// ROUTE 1 : Create a User using: POST "/api/auth/createuser". Doesn't require login
router.post("/createuser", [body("name", "Enter a valid name").isLength({ min: 3 }), body("email", "Enter a valid email").isEmail(), body("password", "Password must be at least 5 characters").isLength({ min: 5 })], async (req, res) => {
  let success = false;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    let { email, name, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (name === "" || email === "" || password === "") {
      return res.status(400).json({
        status: "Failed",
        message: "Empty input",
      });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "Failed",
        message: "User with this email already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const otpResult = await sendOTPVerificationEmail(savedUser);

    if (otpResult.status === "failed") {
      return res.status(500).json({ success: false, message: otpResult.message });
    }

    const payload = {
      user: {
        id: savedUser.id,
      },
    };
    const userEmail = savedUser.email;
    const userId = savedUser.id;
    const authToken = jwt.sign(payload, JWT_SECRET);
    console.log(payload);

    success = true;
    return res.json({ success, auth: authToken, userId, userEmail });
  } catch (error) {
    console.error("Error in /createuser:", error.message);
    return res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
});

// ROUTE 2 : Create a User using: POST "/api/auth/login". Doesn't require login
router.post(
  "/login",
  //giving some criteria for our data to be valid EXPRESS_VALIDATOR is use for validating the data
  [body("email", "Enter a valid email").isEmail(), body("password", "Password cannot be empty").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    // if our data is not valid then we send a bad request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructuing to extract email and password

    const { email, password } = req.body;
    try {
      let success = false;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ success, errors: "Pls login with correct credentials" });
      }
      const name = user.name;
      // we are comparing the 2 passwords here password is the password the user is trying to login with and user.password is taken from the database with the given email which is a hash
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ success, errors: "Pls login with correct credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(payload, JWT_SECRET);
      success = true;

      res.json({ success, auth: authtoken, name });
    } catch (error) {
      //catching errors
      console.error(error.message);
      res.status(500).send("Internal Server occured");
    }
  }
);

// ROUTE 3 : Get Logged in user's details using: POST "/api/auth/getuser". require login
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    //catching errors
    console.error(error.message);
    res.status(500).send("Internal Server occured");
  }
});

// Route 4 : Verify Email

router.post("/verifyOTP", async (req, res) => {
  try {
    let { userId, otp } = req.body;

    if (!userId || !otp) {
      throw Error("Empty opt details Are not allowed");
    } else {
      const UserOTPVerificationRecords = await UserOTPVerification.find({ userId });
      console.log(UserOTPVerificationRecords);

      if (UserOTPVerificationRecords.length <= 0) {
        throw new Error("Account record doen't exist or has been verified already. Please sign up or login");
      } else {
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;
        if (expiresAt < Date.now()) {
          await UserOTPVerification.deleteMany({ userId });
          throw Error("Code has Expired. pls try again");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) {
            throw new Error("Invalid code . Check your inbox");
          } else {
            await User.updateOne({ _id: userId }, { verified: true });
            await UserOTPVerification.deleteMany({ userId });
            res.json({
              status: "verified",
              message: "user email verified successfully",
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
});

const sendOTPVerificationEmail = async ({ _id, email }) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter <b>${otp}</b> in the Node-X application to verify your Email Address And complete the verification process.</p><p>The OTP will expire in <b>1 Hour</b>.</p>`,
    };
    const saltRounds = await bcrypt.genSalt(10);
    let hashedOTP = await bcrypt.hash(otp, saltRounds);

    await UserOTPVerification.create({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await transporter.sendMail(mailOptions);
    return {
      status: "pending",
      message: "Verification Code Sent",
      data: {
        userId: _id,
        email,
      },
    };
  } catch (error) {
    return {
      status: "failed",
      message: error.message,
    };
  }
};

// resend verify

router.post("/resendOTP", async (req, res) => {
  try {
    let { userId, email } = req.body;
    if (!userId || !email) {
      throw Error("Empty user details are not allowed");
    } else {
      await UserOTPVerification.deleteMany({ userId });
      sendOTPVerificationEmail({ _id: userId, email }, res);
      res.json({
        status: "sent",
      });
    }
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
});
module.exports = router;
