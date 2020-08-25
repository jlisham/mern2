const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const { json } = require("express");

//@route  GET api/user
//@desc   get all users
//@access Public
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error: #u2065");
  }
});

//@route  POST api/user
//@desc   Register user
//@access Public
router.put(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "a valid email is required").isEmail(),
    check("password", "password of 6 or more chars").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }
      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
      user = new User({ name, email, avatar, password });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: { id: user.id },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error: #u6665");
    }
  }
);

module.exports = router;
