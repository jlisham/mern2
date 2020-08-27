const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { post } = require("request");

//@route  GET api/profile
//@desc   get all profiles
//@access Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error: #pr1865");
  }
});

//@route  GET api/profile/user/:user_id
//@desc   get profile by user ID
//@access Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("server error: #pr3965");
  }
});

//@route  DELETE api/profile
//@desc   DELETE profile, user & posts using id (if provided) or token
//@access Private
router.delete("/:user_id?", auth, async (req, res) => {
  let id = req.params.user_id || req.user.id;
  try {
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndDelete({ user: id });
    await User.findOneAndDelete({ _id: id });
    res.json("deleted");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error: #pr5465");
  }
});

//@route  GET api/profile/curr
//@desc   get current user's profile
//@access Private
router.get("/curr", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error: #pr7265");
  }
});

//@route  GET api/profile
//@desc   create or update user profile
//@access Private
router.put(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skill field is required").not().isEmpty(),
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
      company,
      website,
      location,
      status,
      skills,
      githubusername,
      bio,
      experience,
      education,
      facebook,
      instagram,
      linkedin,
      twitter,
      youtube,
    } = req.body;

    const profileFields = { status };
    profileFields.user = req.user.id;
    company ? (profileFields.company = company) : null;
    website ? (profileFields.website = website) : null;
    location ? (profileFields.location = location) : null;
    bio ? (profileFields.bio = bio) : null;
    experience ? (profileFields.experience = experience) : [];
    education ? (profileFields.education = education) : [];
    githubusername ? (profileFields.githubusername = githubusername) : null;
    profileFields.skills = skills
      ? skills.split(",").map((skill) => skill.trim())
      : [];
    profileFields.social = {};
    facebook ? (profileFields.social.facebook = facebook) : null;
    youtube ? (profileFields.social.youtube = youtube) : null;
    twitter ? (profileFields.social.twitter = twitter) : null;
    instagram ? (profileFields.social.instagram = instagram) : null;
    linkedin ? (profileFields.social.linkedin = linkedin) : null;
    // console.log(profileFields);
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      } //create
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error: #pr14765");
    }
  }
);

//@route  PUT api/profile/experience
//@desc   add profile experience
//@access Private
router.put(
  "/experience", ///:profile_id?/:exp_id?",
  [
    auth,
    [
      check("title", "TITLE is required").not().isEmpty(),
      check("company", "COMPANY is required").not().isEmpty(),
      check("from", "Start Date/FROM is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    let id = req.params.exp_id ? req.params.exp_id : null;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;
    const exp = {
      company,
      title,
      from,
    };
    location ? (exp.location = location) : null;
    to ? (exp.to = to) : null;
    current ? (exp.current = current) : null;
    description ? (exp.description = description) : null;
    try {
      // if (id == null) {
      //if there's a previous record, update it otherwise create a new one
      const profile = await Profile.findOne(
        { user: req.user.id }
        // id ? { experience: id } :
      );
      // console.log(profile);
      profile.experience.unshift(exp);
      // } else {
      //   const exp = await Profile.findOneAndUpdate(
      //     { experience: id },
      //     { $set: exp },
      //     { new: true }
      //   );
      // }
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error: #pr20965");
    }
  }
);

//@route  DELETE api/profile/experience
//@desc   DELETE experience from profile
//@access Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const rmvIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(rmvIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error: #pr22865");
  }
});
module.exports = router;
