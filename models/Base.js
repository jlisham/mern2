const mongoose = require("mongoose");

const BaseSchema = new mongoose.Schema(
  {
    status: { type: String, required: true, default: "active" },
    visibility: { type: String, required: true, default: "public" },
  },
  { timestamps: { createdAt: "created", updatedAt: "lastUpdate" } }
);
module.exports = Base = mongoose.model("Base", BaseSchema);
