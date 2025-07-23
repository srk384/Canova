const express = require("express");
const router = express.Router();
const { createForm, getUserForms, getFormsByProject, insertFormInProject } = require("../controllers/formController");
const { verifyJWT } = require("../middlewares/jwtMiddleware");

router.post("/create-form", verifyJWT, createForm);

router.get("/projects/:id/forms", verifyJWT, getFormsByProject);

router.get("/forms", verifyJWT, getUserForms);

router.post("/project/:id", verifyJWT, insertFormInProject);

module.exports = router;
