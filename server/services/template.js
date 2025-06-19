const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const getTemplates = async () => {
  try {
    const templates = await prisma.template.findMany({
      include: {
        items: true,
      },
    });
    return templates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
}

const uploadTemplate = async (templateData) => {
  try {
   //template data is a array having name,templateId(unique) ,address and value
    const newTemplates=[]   ;
    for(const template of templateData) {
      const {name, templateId, address, value} = template;
      const newTemplate = await prisma.template.upsert({
        where: { templateId },
        update: {
          name,
          items: {
            upsert: {
              where: { address },
              update: { value },
              create: { address, value },
            },
          },
        },
        create: {
          name,
          templateId,
          items: {
            create: {
              address,
              value,
            },
          },
        },
      });
      newTemplates.push(newTemplate);
    }
    return newTemplates;
  } catch (error) {
    console.error('Error uploading template:', error);
    throw error;
  }
}

const createTemplate = async (data) => {
  try {
    const { name, templateId, items } = data;
    const newTemplate = await prisma.template.create({
      data: {
        name,
        templateId,
        items: {
          create: items.map(item => ({
            address: item.address,
            value: item.value,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    return newTemplate;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
}

const updateTemplate = async (id, data) => {
  try {
    const { name, templateId, items } = data;
    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: {
        name,
        templateId,
        items: {
          create: items.map(item => ({
            address: item.address,
            value: item.value,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    return updatedTemplate;
  } catch (error) {
    console.error('Error updating template:', error);
    throw error;
  }
}

const deleteTemplate = async (id) => {
  try {
    // First delete all items associated with the template
    await prisma.templateItem.deleteMany({
      where: { templateId: id },
    });
    await prisma.template.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
}

module.exports = {
  getTemplates,
  uploadTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
}