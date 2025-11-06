const express = require("express");
const router = express.Router();
const deviceUpload = require("../../controllers/uploads/devices");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("device"), deviceUpload.uploadDevices);

module.exports = router;
