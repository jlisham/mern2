const mongoose = require("mongoose");

const FarmSchema = new mongoose.Schema(
  {
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    name: {
      type: String,
      required: true,
    },
    status: { type: String, require: true, default: "active" },
    desc: {
      type: String,
      required: true,
    },
    hours: {
      type: String,
    },
    ship: {
      type: String,
    },
    keywords: {
      type: [String],
    },
    product: [
      {
        name: { type: String, required: true },
        keywords: { type: String },
        desc: { type: String, required: true },
        category: { type: String, required: true },
        currAvail: { type: Boolean, default: true, required: true },
        availStart: { type: String, required: true },
        availEnd: { type: String, required: true },
      },
    ],
    socialMedia: [
      {
        type: { type: String, required: true },
        handle: { type: String, required: true },
      },
    ],
    payment: { type: [String], required: true },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "farm",
      },
    ],
    url: {
      type: String,
    },
  },
  { timestamps: { createdAt: "created", updatedAt: "lastUpdate" } }
);
module.exports = Farm = mongoose.model("Farm", FarmSchema);
