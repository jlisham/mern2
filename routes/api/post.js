const express = require("express");
const ObjectId = require("mongoose").Types.ObjectId;
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route  GET api/post
//@desc   get all posts
//@access Private
router.get("/:id?", auth, async (req, res) => {
  let id = null;
  if (req.params.id) {
    id = ObjectId.isValid(req.params.id) ? req.params.id : null;
    if (!id) {
      return res.status(404).json({ msg: "Post not found" });
    }
  }
  try {
    const posts = await Post.find(id ? { _id: id } : null).sort({ date: -1 });
    if (posts.length < 1) {
      return res.status(404).json({ msg: "no posts returned" });
    }
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error: #p3065");
  }
});

//@route  DELETE api/post
//@desc   DELETE post, reviews, addresses using id
//@access Private
router.delete("/:id?", auth, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Not a valid Post.");
  }
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id });
    if (!post) {
      return res.status(400).send("Post not found.");
    } else if (post.user.toString() !== req.user.id) {
      return res.status(400).send("That action is not authorized.");
    }
    res.json("deleted");
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Not a valid Post." });
    }
    res.status(500).send("server error: #p5465");
  }
});

//@route  Put api/post
//@desc   create a post
//@access Private
router.put(
  "/",
  [auth, [check("text", "text field is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const user = await User.findById(req.user.id).select("-password");
        // console.log(user);
        const newPost = {
          text: req.body.text,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id,
        };
        const post = await new Post(newPost).save();
        res.json(post);
      } catch (err) {
        console.error(err.message);
        res.status(500).json("server error: #p8065");
      }
    } else {
      return res.status(400).json({ errors: errors.array() });
    }
  }
);

//@route  Put api/post/like/:id
//@desc   like a post
//@access Private
router.put("/like/:id", auth, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Not a valid Post.");
  }
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      const result = post.likes.filter(
        (like) => like.user.toString() === req.user.id
      );
      result.length > 0
        ? post.likes.splice({ user: req.user.id })
        : post.likes.push({ user: req.user.id });
      await post.save();
    }
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("server error: #p10965");
  }
});

//@route  Put api/post/dislike/:id
//@desc   dislike a post
//@access Private
router.put("/dislike/:id", auth, async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Not a valid Post.");
  }
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      const result = post.dislikes.filter(
        (like) => like.user.toString() === req.user.id
      );
      result.length > 0
        ? post.dislikes.splice({ user: req.user.id })
        : post.dislikes.push({ user: req.user.id });
      await post.save();
    }
    res.json(post.dislikes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("server error: #p10965");
  }
});

//@route  Put api/post/comment/:postID
//@desc   create a post comment
//@access Private
router.put(
  "/comment/:postID",
  [auth, [check("text", "text field is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      try {
        const user = await User.findById(req.user.id).select("-password");
        const post = await Post.findById(req.params.postID);
        const comment = {
          text: req.body.text,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id,
        };
        post.comments.push(comment);
        await post.save();
        res.json(post);
      } catch (err) {
        console.error(err.message);
        res.status(500).json("server error: #p13665");
      }
    } else {
      return res.status(400).json({ errors: errors.array() });
    }
  }
);

//@route  DELETE api/post/comment/:postID/:commentID
//@desc   DELETE post comment
//@access Private
router.delete("/comment/:postID/:commentID", auth, async (req, res) => {
  if (!ObjectId.isValid(req.params.postID)) {
    return res.status(400).send("Not a valid Post.");
  } else if (!ObjectId.isValid(req.params.commentID)) {
    return res.status(400).send("Not a valid Comment.");
  }
  try {
    const post = await Post.findById({
      _id: req.params.postID,
    });
    const comment = post.comments.find(
      (comment) => comment.id === req.params.commentID
    );
    if (!comment) {
      return res.status(400).send("Comment not found.");
    } else if (comment.user.toString() !== req.user.id) {
      return res.status(400).send("That action is not authorized.");
    }
    const rmvIndex = post.comments
      .map((item) => item.id)
      .indexOf(req.params.commentID);
    post.comments.splice(rmvIndex, 1);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Not a valid Comment." });
    }
    res.status(500).send("server error: #p17665");
  }
});

module.exports = router;
