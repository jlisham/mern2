const express = require("express");
const config = require("config");
const ObjectId = require("mongoose").Types.ObjectId;
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth");

const Farm = require("../../models/Farm");
const Review = require("../../models/Review");

//@route  GET api/farm
//@desc   get one (if id is included) or all
//@access Public
router.get("/:farmID?", async (req, res) => {
  try {
    const farms = await Farm.find(
      req.params.farmID ? { _id: req.params.farmID } : null
    ).populate("users.user", ["name"]);
    res.json(farms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error: #f2265");
  }
});

//@route  DELETE api/farm
//@desc   DELETE farm, reviews, addresses using id
//@access Private
router.delete("/:farmID?", auth, async (req, res) => {
  if (!ObjectId.isValid(req.params.farmID)) {
    res.status(500).send("The Farm record could not be deleted.");
  }
  try {
    await Farm.findOneAndDelete({ _id: req.params.farmID });
    // await Review.findOneAndDelete({ _id: id });
    res.json("deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error: #f3965");
  }
});

//@route  GET api/farm
//@desc   create or update user farm
//@access Private
router.put(
  "/:farmID?",
  [
    auth,
    [
      check("name", "Status is required").not().isEmpty(),
      check("keywords", "Skill field is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // process.on("uncaughtException", function (err) {
    //   console.log(err);
    // });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      user,
      name,
      desc,
      phone,
      email,
      url,
      ship,
      hours,
      product,
      socialMedia,
      payment,
      keywords,
      address,
    } = req.body;

    const farmFields = { user, name };
    farmFields.user = user ? user : req.user.id;
    desc ? (farmFields.desc = desc) : null;
    address ? (farmFields.address = address) : [];
    phone ? (farmFields.phone = phone) : null;
    email ? (farmFields.email = email) : null;
    url ? (farmFields.url = url) : null;
    hours ? (farmFields.hours = hours) : null;
    ship ? (farmFields.ship = ship) : false;
    product ? (farmFields.product = product) : [];
    socialMedia ? (farmFields.socialMedia = socialMedia) : [];
    payment ? (farmFields.payment = payment) : [];
    farmFields.keywords = keywords
      ? keywords.split(",").map((keyword) => keyword.trim())
      : [];
    try {
      if (ObjectId.isValid(req.params.farmID)) {
        //if an ObjectId is included, look for the record
        let farm = await Farm.findOne({ _id: req.params.farmID });
        if (farm) {
          //if the record exists, update it
          farm = await Farm.findOneAndUpdate(
            { _id: req.params.farmID },
            { $set: farmFields },
            { new: true }
          );
          return res.json(farm);
        }
      } //otherwise, create a new one
      farm = new Farm(farmFields);
      await farm.save();
      return res.json(farm);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error: #f11365");
    }
  }
);

module.exports = router;
