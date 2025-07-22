const bcrypt = require("bcrypt");
const { generateToken } = require("../middlewares/jwtMiddleware");
const User = require("../models/userModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const signUp = async (req, res) => {
  const { name, email, password } = req.body.post;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name: name,
        email: email,
        password: encryptedPassword,
      });
      const token = generateToken(newUser);
      newUser.password = undefined;
      return res.status(201).json({ user: newUser, token: token });
    }

    return res.status(401).json({ error: "User already exist" });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body.post;

  try {
    const user = await User.findOne({ email: email });

    if (!user) res.status(400).json({ error: "User does not exist" });

    if (user && (await bcrypt.compare(password, user.password))) {
      user.password = undefined; // preventing password to send to the client
      const token = generateToken(user);

      return res.status(200).json({ user: user, token: token });
    } else {
      return res.status(400).json({ error: "Incorrect Password" });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: "User not found" });

  const otp = crypto.randomInt(100000, 1000000).toString();
  user.resetOTP = otp;
  user.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // expires in 10 minutes
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Password Reset",
    html: `<p>Your OTP for password reset is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
  });

  res.json({ message: "OTP sent to email", OTP: otp }); // remove otp from here before deploying
};


const verifyOTP = async (req, res) => {
  const { email, otp } = req.body.post;
  const user = await User.findOne({ email });

  if (!user || user.resetOTP !== otp || user.resetOTPExpiry < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.otpVerified = true;
  user.otpVerifiedAt = new Date();
  await user.save();

  res.json({ message: "OTP verified" });
};



const resetPassword = async (req, res) => {
  const { email, password } = req.body.post;
  const user = await User.findOne({ email });

 if (
    !user.otpVerified ||
    !user.otpVerifiedAt ||
    Date.now() - user.otpVerifiedAt.getTime() > 10 * 60 * 1000
  ) {
    return res.status(403).json({ error: "OTP verification required" });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  user.password = encryptedPassword;
  user.resetOTP = undefined;
  user.resetOTPExpiry = undefined;
  user.otpVerified = false;
  user.otpVerifiedAt = undefined;

  await user.save();

  res.json({ message: "Password updated successfully" });
};


module.exports = {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  verifyOTP,
};
