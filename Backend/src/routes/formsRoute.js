const express = require("express");
const router = express.Router();
const { createForm, getUserForms, getFormsByProject, insertFormInProject, getFormById, addPage, getPages } = require("../controllers/formController");
const { verifyJWT } = require("../middlewares/jwtMiddleware");

router.post("/create-form", verifyJWT, createForm);

router.get("/projects/:id/forms", verifyJWT, getFormsByProject);

router.get("/forms", verifyJWT, getUserForms);

router.post("/project/:id", verifyJWT, insertFormInProject);

router.get("/form/:id", verifyJWT, getFormById);

router.post("/update/:id", verifyJWT, addPage);

router.get("/pages/:id", verifyJWT, getPages);

module.exports = router;
