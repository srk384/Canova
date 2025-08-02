const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares/jwtMiddleware");
const {saveDraft, getSavedDraft, publishForm } = require('../controllers/draftPublishController')

router.put("/:formId/save", verifyJWT, saveDraft);
router.get("/:formId", verifyJWT, getSavedDraft);


router.put("/:formId/publish", verifyJWT, publishForm);



module.exports = router;

