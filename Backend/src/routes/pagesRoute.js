const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares/jwtMiddleware");
const {addQuestions, getQuestions} = require('../controllers/pageController')

router.post("/:id", verifyJWT, addQuestions);

router.get("/:id", verifyJWT, getQuestions);


module.exports = router;

