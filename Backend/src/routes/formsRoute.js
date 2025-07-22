const express = require("express");
const router = express.Router();
const { createProjectAndForm, getUserProjects, getProjectById } = require("../controllers/projectController");
const { createForm, getUserForms, getFormsByProject } = require("../controllers/formController");
const { verifyJWT } = require("../middlewares/jwtMiddleware");

router.post("/create-form", verifyJWT, createForm);

router.get("/projects/:id/forms", verifyJWT, getFormsByProject);

router.get("/forms", verifyJWT, getUserForms);

module.exports = router;
