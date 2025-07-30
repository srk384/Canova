const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares/jwtMiddleware");
const {saveDraft, getSavedDraft} = require('../controllers/draftPublishController')

router.put("/:formId/save", verifyJWT, saveDraft);

router.get("/:formId", verifyJWT, getSavedDraft);


module.exports = router;

