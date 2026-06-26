const express = require("express");
const router = express.Router();
const uploadDevices = require("./devices");
const uploadMappings = require("./mappings");
const uploadCustomers = require("./customers");
const uploadUsers = require("./users")

router.use("/devices", uploadDevices);
router.use("/mappings", uploadMappings);
router.use("/customers", uploadCustomers);
router.use("/user", uploadUsers)

module.exports = router;
