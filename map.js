const nodeGeocoder = require("node-geocoder");

const options = {
  provider: "here",
  apiKey: "6zBvoiInwsV-sCr5ao65EOiulD8_JgvXXZxtra3saWQ",
};
const geoCoder = nodeGeocoder(options);
geoCoder

  .geocode("2598 145th Ave; 55030")
  .then((res) => {
    console.log(res);
    if (res.length == 1) {
      console.log(res[0].latitude);
      console.log(res[0].longitude);
    } else {
      for (let address of res) {
        console.log(address.zipcode);
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });
