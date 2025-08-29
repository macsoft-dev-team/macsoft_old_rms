const express = require("express");
const router = express.Router();
const mappingController = require("../controllers/mappings");
 const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, mappingController.getAllDevices);
router.get("/:imeinumber", verifyToken, mappingController.getDeviceById);
router.put("/:imeinumber", verifyToken, mappingController.updateDevice);
    
module.exports = router;
