const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("mongoDB connected...");
  } catch (err) {
    console.error(err.message);
    //exit process with failrure
    process.exit(1);
  }
};

module.exports = connectDB;
