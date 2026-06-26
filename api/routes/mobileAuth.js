const express = require("express");
const mobileAuthController = require("../controllers/mobileAuth");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/register", mobileAuthController.register);
router.post("/login", mobileAuthController.login);
router.post("/check-mobile", mobileAuthController.checkMobile);
router.get("/me", verifyToken, mobileAuthController.getProfile);
router.post("/admin-login", mobileAuthController.adminLogin);
module.exports = router;
