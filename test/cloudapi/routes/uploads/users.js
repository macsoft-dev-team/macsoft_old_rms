const express = require("express");
const router = express.Router();
const userUpload = require("../../controllers/uploads/users");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("user"), userUpload.uploadUsers);

module.exports = router;
