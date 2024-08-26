const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
//for password encryption
const bcrypt = require("bcryptjs");
//for genereating verification token
const jwt = require("jsonwebtoken");
// JWT_secret is written here because multiple rotue may need  it
const JWT_SECRET = "SOME_RANDOM_SEQURE_STUFF";

var fetchuser = require("../middleware/fetchuser");

// ROUTE 1 : Create a User using: POST "/api/auth/createuser". Doesn't require login
router.post(
  "/createuser",
  //giving some criteria for our data to be valid EXPRESS_VALIDATOR is use for validating the data
  [body("name", "Enter a valid name").isLength({ min: 3 }), body("email", "Enter a valid email").isEmail(), body("password", "Password must be atleast 5 characters").isLength({ min: 5 })],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    // if our data is not valid then we send a bad request
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    // checking if the user with this email already exist

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, error: "user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const payload = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(payload, JWT_SECRET);
      success = true;
      res.json({ success, auth: authtoken });
    } catch (error) {
      //catching errors
      console.error(error.message);
      res.status(500).send("Internal Server occured");
    }
  }
);

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
      res.json({ success, auth: authtoken });
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
module.exports = router;
