const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://alanbronner:uiVrazQeL4mhid7@marvel.awrr3.mongodb.net/<dbname>?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  }
);

mongoose.connection.on("error", (error) => {
  console.log("error occured", error);
});
mongoose.connection.on("connected", () => {
  console.log("db is connected");
});

module.exports = mongoose;
