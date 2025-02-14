require("dotenv").config();
//import dotenv from "dotenv";
//dotenv.config();

//import express from "express";
const express = require("express");
const router = express.Router();
//import cors from "cors";
const cors = require("cors");
//import nodemailer from "nodemailer";
const nodemailer = require("nodemailer");

// server used to send send emails
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(5001, () => console.log("Server Running"));
// console.log(process.env.RECEIVER_EMAIL);
// console.log(process.env.RECEIVER_PASS);
const user = process.env.RECEIVER_EMAIL;
const pass = process.env.RECEIVER_PASS;

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: user,
    pass: pass
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.firstName + " " + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  console.log("Email from contact form:", email);
  const mail = {
    from: `${email}`,
    to: user,
    subject: "Contact Form Submission - Portfolio",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});