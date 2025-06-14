const express = require('express');
const router = express.Router();
const { loginUser } = require('../middleware/login');

router.post('/login', loginUser);

module.exports = router;
