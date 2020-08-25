const express = require("express");
const config = require("config");
const ObjectId = require("mongoose").Types.ObjectId;
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth");

const Review = require("../../models/Review");

//@route  GET api/review/authored
//@desc   get one (if id is included) or all
//@access Public
router.get("/authored/:userID", async (req, res) => {
  const userID = ObjectId.isValid(req.params.userID) ? req.params.userID : null;
  // console.log(userID);
  if (!userid) {
    res.status(500).send("That user doesn't exist");
  }
  try {
    const review = await Review.find({ user: userID });
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error: #r2465");
  }
});

//@route  GET api/review
//@desc   get one (if id is included) or all
//@access Public
router.get("/:list?/:listID?/:revID?", async (req, res) => {
  const listID = ObjectId.isValid(req.params.listID) ? req.params.listID : null;
  const id = ObjectId.isValid(req.params.id) ? req.params.id : null;
  try {
    const review = await Review.find(
      //if there's a review id, load it otherwise load all the ratings for the farm
      listID ? { [req.params.list]: listID } : null
    );
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error: #r4265");
  }
});

//@route  DELETE api/review
//@desc   DELETE reviews, reviews, addresses using id
//@access Private
router.delete("/:revID?", auth, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.revID)) {
      //valid object_id wasn't included
      res.status(500).send("The Review could not be deleted.");
    }
    await Review.findOneAndDelete({ _id: req.params.revID });
    // await Review.findOneAndDelete({ _id: id });
    res.json("deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error: #r6065");
  }
});

//@route  GET api/review
//@desc   create or update farm review
//@access Private
router.put(
  "/:farmID/:revID?",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("desc", "A Description is required").not().isEmpty(),
      check("rating", "A rating is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { user, title, desc, rating } = req.body;

    const reviewFields = { user };
    reviewFields.farm = req.params.farmID;
    reviewFields.user = req.user.id;
    title ? (reviewFields.title = title) : null;
    desc ? (reviewFields.desc = desc) : null;
    rating ? (reviewFields.rating = rating) : null;
    try {
      if (ObjectId.isValid(req.params.revID)) {
        //if an ObjectId is included, look for the record
        let review = await Review.findOne({ _id: req.params.revID });
        if (review) {
          //if the record exists, update it
          review = await Review.findOneAndUpdate(
            { _id: req.params.revID },
            { $set: reviewFields },
            { new: true }
          );
          return res.json(review);
        }
      } //otherwise, create a new one
      review = new Review(reviewFields);
      await review.save();
      return res.json(review);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error: #r10965");
    }
  }
);
module.exports = router;
