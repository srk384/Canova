const express = require("express");
const router = express.Router();
const {
  createProjectAndForm,
  getUserProjects,
  getProjectById,
  deleteProject,
  renameProject
} = require("../controllers/projectController");
const { verifyJWT } = require("../middlewares/jwtMiddleware");

router.post("/create-project", verifyJWT, createProjectAndForm);

router.get("/projects", verifyJWT, getUserProjects);
router.get("/projects/:id", verifyJWT, getProjectById);

router.delete("/:id/delete", verifyJWT, deleteProject);
router.put("/:id/rename", verifyJWT, renameProject);

module.exports = router;
