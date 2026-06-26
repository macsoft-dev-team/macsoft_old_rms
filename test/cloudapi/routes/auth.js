const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth');

 
router.post('/login', auth.login);
router.get('/verify', auth.verifyToken);
router.post('/logout', auth.logout);
router.get('/check', auth.checkAuth);

module.exports = router;
