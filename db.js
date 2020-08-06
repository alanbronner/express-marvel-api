const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mern_marvel", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

mongoose.connection.on("error", (error) => {
  console.log("error occured", error);
});
mongoose.connection.on("connected", () => {
  console.log("db is connected");
});

module.exports = mongoose;
