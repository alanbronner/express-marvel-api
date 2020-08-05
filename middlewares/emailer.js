"use strict";
const nodemailer = require("nodemailer");

const emailer = async (email, token, name, version) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "hellofrommarvel@gmail.com",
      pass: "Motus2020!",
    },
  });

  const versionA = {
    from: '"Marvel 👋" <hellofrommarvel@gmail.com>',
    to: email,
    subject: "Please confirm your account! 🙋‍♀️🙋‍♂️",
    html: `<h1>Hello ${name}!</h1>
      <p>You're almost there one more step and it will be good</p>
      <p>Please, click on the following <a href="http://localhost:3001/confirmation/${token}">link</a> to verify your account</p>  
      <p>Until next time,</p>
      <p>The Avengers 💪 (email send from a node server)</p>`,
  };

  const versionB = {
    from: '"Marvel 👋" <hellofrommarvel@gmail.com>',
    to: email,
    subject: "And There you go 🎉🎉😍",
    html: `
      <img src="https://media1.tenor.com/images/22b2c7ca5c9ca6c48a1d148ebdd9afff/tenor.gif?itemid=8224887" >
      <h1>You made it!</h1>
      <p>The Avengers 💪 (email send from a node server)</p>`,
  };

  const whatVersion = () => {
    return version === "versionA" ? versionA : versionB;
  };

  let toSend = await transporter.sendMail(whatVersion());
};

module.exports = emailer;
