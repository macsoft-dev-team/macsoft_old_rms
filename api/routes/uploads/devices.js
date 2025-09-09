const express = require("express");
const router = express.Router();
const deviceUpload = require("../../controllers/uploads/devices");
  
  
// JSON upload route (new)
router.post("/", deviceUpload.uploadDevicesJSON);

 
module.exports = router;
