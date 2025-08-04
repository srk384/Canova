const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares/jwtMiddleware");
const {addQuestions, getQuestions,renamePage, deletePage, addPage, getPages, colorUpdate} = require('../controllers/pageController')

router.post("/:id", verifyJWT, addQuestions);

router.get("/:id", verifyJWT, getQuestions);
router.get("/:id", verifyJWT, getQuestions);
router.patch("/update/:formId/rename", verifyJWT, renamePage);
router.patch("/update/:formId/delete", verifyJWT, deletePage);
router.patch("/update/:formId/colorUpdate", verifyJWT, colorUpdate);
router.post("/add/:formId", verifyJWT, addPage);
router.get("/get/:formId", verifyJWT, getPages);


module.exports = router;

