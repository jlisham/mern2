const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "farm",
    },
    user: { type: String },
    title: { type: String },
    desc: { type: String },
    rating: { type: String },
  },
  { timestamps: { createdAt: "created", updatedAt: "lastUpdate" } }
);
module.exports = Review = mongoose.model("Review", ReviewSchema);
