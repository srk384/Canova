const express = require("express");
const router = express.Router();
const {
  createForm,
  getUserForms,
  getFormsByProject,
  insertFormInProject,
  getFormById,
  deleteForm,
  renameForm,
} = require("../controllers/formController");
const {
  getSharedForms,
  removeSharedAccess,
} = require("../controllers/sharedFormsController");
const { verifyJWT } = require("../middlewares/jwtMiddleware");

router.post("/create-form", verifyJWT, createForm);

router.get("/projects/:id/forms", verifyJWT, getFormsByProject);

router.get("/forms", verifyJWT, getUserForms);

router.post("/project/:id", verifyJWT, insertFormInProject);

router.get("/form/:id", verifyJWT, getFormById);

router.delete("/form/:id/delete", verifyJWT, deleteForm);

router.put("/form/:id/rename", verifyJWT, renameForm);

//shared forms route
router.get("/sharedforms", verifyJWT, getSharedForms);

router.delete("/:formId/access/remove", verifyJWT, removeSharedAccess);

module.exports = router;
