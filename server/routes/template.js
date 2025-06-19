const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template');

router.get('/', templateController.getTemplates);
router.post('/upload', templateController.uploadTemplate);
router.post('/', templateController.createTemplate);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;