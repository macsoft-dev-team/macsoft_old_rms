const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getTemplates = async (skip, take, filter) => {
  try {
    const params = {
      include: {
        items: true,
      },
    };
    if (skip) params.skip = (parseInt(skip) - 1) * parseInt(take) || 0;
    if (take) params.take = parseInt(take);
    if (filter)
      params.where = {
        OR: [
          { name: { contains: filter, mode: "insensitive" } },
          { items: { some: { address: { contains: filter } } } },
        ],
      };

    const count = await prisma.template.count({ where: params.where || {} });
    const templates = await prisma.template.findMany(params);

    return { templates, count };
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
};

const getTemplateById = async (id) => {
  try {
    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
    if (!template) {
      throw new Error("Template not found");
    }
    return template;
  } catch (error) {
    console.error("Error fetching template by ID:", error);
    throw error;
  }
}

const uploadTemplate = async (templateData) => {
  try {
    const { name, items } = templateData;
    const newTemplates = await prisma.template.create({
      data: {
        name,
        items: {
          create: items.map((item) => ({
            address: item.address,
            value:String(item.value), // Ensure value is stored as a string
          })),
        },
      },
    });
    return newTemplates;
  } catch (error) {
    console.error("Error uploading template:", error);
    throw error;
  }
};

const createTemplate = async (data) => {
  try {
    const { name, templateId, items } = data;
    const newTemplate = await prisma.template.create({
      data: {
        name,
        items: {
          create: items.map((item) => ({
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
    console.error("Error creating template:", error);
    throw error;
  }
};

const updateTemplate = async (id, data) => {
  try {
    const { name, items } = data.data;
    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: {
        name,
        items: {
          deleteMany: {},
          create: items.map((item) => ({
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
    console.error("Error updating template:", error);
    throw error;
  }
};

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
    console.error("Error deleting template:", error);
    throw error;
  }
};

module.exports = {
  getTemplates,
  getTemplateById,
  uploadTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
