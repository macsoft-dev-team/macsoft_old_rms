const express = require("express");
const router = express.Router();
const customerUpload = require("../../controllers/uploads/customers");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("customer"), customerUpload.uploadCustomers);

module.exports = router;
