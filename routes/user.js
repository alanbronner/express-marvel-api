const express = require("express");
const router = express.Router();

const User = require("../models/User");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const emailer = require("../middlewares/emailer");

router.post("/user/sign_up", async (req, res) => {
  try {
    const { email, username, password } = req.fields;

    if (!req.fields) {
      return res
        .status(400)
        .json({ message: "email, username and password are required" });
    }
    const user = await User.findOne({ "account.email": email });
    if (user) {
      return res.status(400).json({ message: "username already register" });
    } else {
      const salt = uid2(16);
      const hash = SHA256(password + salt).toString(encBase64);
      const token = uid2(16);

      const signUp = new User({
        account: {
          username: username,
          email: email,
          token: token,
        },
        hash: hash,
        salt: salt,
      });
      await signUp.save();
      emailer(
        signUp.account.email,
        signUp.account.token,
        signUp.account.username,
        "versionA"
      );

      res.status(200).json({
        message: `confirmation email sent to ${signUp.account.email}`,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/user/confirmation/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ "account.token": token });
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
    if (user.account.confirmed) {
      return res.status(400).json({ message: "Account already verify" });
    } else {
      user.account.confirmed = true;
      await user.save();

      emailer(user.account.email, undefined, user.account.username, "versionB");

      return res.status(200).json({
        account: {
          confirmed: user.account.confirmed,
          token: user.account.token,
        },
        _id: user._id,
      });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.post("/user/log_in", async (req, res) => {
  try {
    const { email, password } = req.fields;

    if (!email || !password) {
      return res.status(400).json({ message: "Email or Password required" });
    }

    const user = await User.findOne({ "account.email": email });
    if (!user) {
      return res.status(400).json({ message: "Invalid login" });
    }

    if (!user.account.confirmed) {
      return res
        .status(400)
        .json({ message: "Please confirm your email to login" });
    }

    const salt = uid2(16);
    const hash = SHA256(password + user.salt).toString(encBase64);

    if (hash === user.hash) {
      return res.status(200).json({
        account: {
          token: user.account.token,
          username: user.account.token,
        },
        _id: user._id,
      });
    } else {
      return res.status(400).json({ message: "Invalid password" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

// auth
router.put(
  "/user/preferences/add_favoris/:id/:favoriteType/:favoriteId/:favoriteName/",
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) {
        return res.status(400).json({ error: "User id not found" });
      }
      if (user) {
        const { id, favoriteType, favoriteId, favoriteName } = req.params;

        const copyFavoris = [...user.preferences.favoris];
        const index = copyFavoris.findIndex((item) => item.id === favoriteId);

        if (index !== -1) {
          return res.status(400).json({ error: "Favorite already in favoris" });
        }

        const favorite = {
          id: favoriteId,
          type: favoriteType,
          name: favoriteName,
          modified: new Date(),
        };

        copyFavoris.push(favorite);
        user.preferences.favoris = copyFavoris;

        await user.save();
        return res.status(200).json({
          message: "Favoris updated",
          preferences: user.preferences,
        });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

router.put(
  "/user/preferences/remove_favoris/:id/:favoriteId",
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) {
        return res.status(400).json({ error: "User id not found" });
      }
      if (user) {
        const { id, favoriteId } = req.params;

        const copyFavoris = [...user.preferences.favoris];
        const index = copyFavoris.findIndex((item) => item.id === favoriteId);

        copyFavoris.splice(index, 1);
        user.preferences.favoris = copyFavoris;
        await user.save();
        return res.status(200).json({
          message: "Favoris updated",
          preferences: user.preferences,
        });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

router.get("/user/:id/preferences/favoris", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }
    if (user) {
      return res.status(200).json({
        username: user.account.username,
        favoris: user.preferences.favoris,
      });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});
module.exports = router;
