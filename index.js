const express = require("express");
const expressFormidable = require("express-formidable");
const mongoose = require("./db");
const cors = require("cors");

const port = process.env.PORT || 3000;
const app = express();

app.use(expressFormidable());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello marvel" });
});

const userRoute = require("./routes/user");
app.use(userRoute);

app.get("*", (req, res) => {
  res.status(400).json({ message: "page not found" });
});

app.listen(port, () => {
  console.log(`server is up and running on port:${port}`);
});
