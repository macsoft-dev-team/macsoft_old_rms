const express = require("express");
const router = express.Router();
const deviceUpload = require("../../controllers/uploads/mappings");

router.post("/", deviceUpload.uploadDevices);

module.exports = router;
