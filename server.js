const express = require("express");
const connectDB = require("./config/db");

const app = express();
//connect db
connectDB();

//init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));

//define routes
// app.use("/map", require("map"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/farm", require("./routes/api/farm"));
app.use("/api/post", require("./routes/api/post"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/review", require("./routes/api/review"));
app.use("/api/user", require("./routes/api/user"));

const PORT = 5000; //process.env.PORT ||

app.listen(PORT, () => console.log(`server running: port ${PORT}`));
