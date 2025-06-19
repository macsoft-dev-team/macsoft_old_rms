const templateService = require('../services/template');

const getTemplates = async (req, res) => {
  try {
    const templates = await templateService.getTemplates();
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
}

const uploadTemplate = async (req, res) => {
  try {
    const templateData = req.body; // Expecting an array of template objects
    const newTemplates = await templateService.uploadTemplate(templateData);
    res.status(201).json(newTemplates);
  } catch (error) {
    console.error('Error uploading template:', error);
    res.status(500).json({ error: 'Failed to upload template' });
  }
}

const createTemplate = async (req, res) => {
  try {
    const data = req.body; // Expecting an object with name, templateId, and items
    const newTemplate = await templateService.createTemplate(data);
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
}

const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params; // Expecting the template ID in the URL
    const data = req.body; // Expecting an object with updated fields
    const updatedTemplate = await templateService.updateTemplate(id, data);
    res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
}

const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params; // Expecting the template ID in the URL
    await templateService.deleteTemplate(id);
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
}

module.exports = {
  getTemplates,
  uploadTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};