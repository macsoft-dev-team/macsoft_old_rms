const express = require("express");
const router = express.Router();
const deviceUpload = require("../../controllers/uploads/mappings");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("device"), deviceUpload.uploadDevices);

module.exports = router;
