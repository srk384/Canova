const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  verifyOTP,
} = require("../controllers/userController");
const { verifyJWT } = require("../middlewares/jwtMiddleware");

router.post("/signUp", signUp);
router.post("/signin", signIn);
router.post("/verify", verifyJWT, (req, res) => {
  res.status(200).json(req.user);
});

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOTP);

module.exports = router;
