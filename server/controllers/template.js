const templateService = require('../services/template');

const getTemplates = async (req, res) => {
  try {
    const {skip,take,filter} = req.query;
    const {templates,count} = await templateService.getTemplates(skip,take,filter);
    res.status(200).json({templates,totalPages: Math.ceil(count / 10), currentPage: req.query.page || 1});
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
}

const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;  
    const template = await templateService.getTemplateById(id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.status(200).json(template);
  } catch (error) {
    console.error('Error fetching template by ID:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
}

const uploadTemplate = async (req, res) => {
  try {
    const templateData = req.body; 
    const newTemplates = await templateService.uploadTemplate(templateData);
    res.status(201).json(newTemplates);
  } catch (error) {
    console.error('Error uploading template:', error);
    res.status(500).json({ error: 'Failed to upload template' });
  }
}

const createTemplate = async (req, res) => {
  try {
    const data = req.body;  
    const newTemplate = await templateService.createTemplate(data);
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
}

const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;  
    const data = req.body; 
    const updatedTemplate = await templateService.updateTemplate(id, data);
    res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
}

const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;  
    const result = await templateService.deleteTemplate(id);
    res.status(204).json(result); 
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
}

module.exports = {
  getTemplates,
  getTemplateById,
  uploadTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};