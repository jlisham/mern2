const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    farm: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "farm",
      },
    ],
    street1: { type: String, required: true },
    street2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    lat: { type: String, required: true },
    long: { type: String, required: true },
  },
  { timestamps: { createdAt: "created", updatedAt: "lastUpdate" } }
);
module.exports = Address = mongoose.model("Address", AddressSchema);
