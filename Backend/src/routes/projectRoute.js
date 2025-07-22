const express = require("express");
const router = express.Router();
const { createProjectAndForm, getUserProjects, getProjectById } = require("../controllers/projectController");
const { verifyJWT } = require("../middlewares/jwtMiddleware");

router.post("/create-project", verifyJWT, createProjectAndForm);

router.get("/projects", verifyJWT, getUserProjects);

module.exports = router;
