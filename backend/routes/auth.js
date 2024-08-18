const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
//for password encryption
const bcrypt = require("bcryptjs");
//for genereating verification token
const jwt = require("jsonwebtoken");

// Create a User using: POST "/api/auth/createuser". Doesn't require login
router.post(
  "/createuser",
  //giving some criteria for our data to be valid EXPRESS_VALIDATOR is use for validating the data
  [body("name", "Enter a valid name").isLength({ min: 3 }), body("email", "Enter a valid email").isEmail(), body("password", "Password must be atleast 5 characters").isLength({ min: 5 })],
  async (req, res) => {
    const errors = validationResult(req);
    // if our data is not valid then we send a bad request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // checking if the user with this email already exist

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt); // this returns a promise so we have to wait for it
      //create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      data = {
        user: {
          id: user.id,
        },
      };
      const JWT_SECRET = "SOME_RANDOM_SEQURE_STUFF";
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ auth: authtoken });
    } catch (error) {
      //catching errors
      console.error(error.message);
      res.status(500).send("some error has occured");
    }
  }
);

module.exports = router;
