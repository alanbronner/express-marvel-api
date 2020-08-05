const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  account: {
    username: { type: String, required: true },
    email: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    token: { type: String, required: true },
  },
  preferences: {
    favoris: { type: Array, default: [] },
  },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
});

const name = "User";
const User = mongoose.model(name, UserSchema);

module.exports = User;
