const express = require("express");
const config = require("config");
const { check, validationResult } = require("express-validator");
const apiKey = config.get("HEREapiKey");
const nodeGeocoder = require("node-geocoder");
const router = express.Router();
const auth = require("../../middleware/auth");

const Farm = require("../../models/Farm");
const options = {
  provider: "here",
  apiKey,
};
const geoCoder = nodeGeocoder(options);

// geoCoder
//   .geocode("2598 145th Ave; 55030")
//   .then((res) => {
//     console.log(res);
//     if (res.length == 1) {
//       console.log(res[0].latitude);
//       console.log(res[0].longitude);
//     } else if (res.length == 0) {
//       alert(
//         "sorry, wasn't able to locate your address to retrieve GPS coordinates"
//       );
//     } else {
//       for (let address of res) {
//         console.log(address.zipcode);
//       }
//     }
//   })
//   .catch((err) => {
//     console.log(err);
//   });
