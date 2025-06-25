const customerService = require('../services/customers');

const getCustomers = async (req, res) => {
  try {
    const { skip, take, filter } = req.query;
    const { customers, count } = await customerService.getCustomers(skip, take, filter);
    res.status(200).json({ customers, totalPages: Math.ceil(count / 10), currentPage: req.query.page || 1 });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await customerService.getCustomerById(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};

const createCustomer = async (req, res) => {
  try {
    const data = req.body;
    const newCustomer = await customerService.createCustomer(data);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedCustomer = await customerService.updateCustomer(id, data);
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await customerService.deleteCustomer(id);
    res.status(204).json(result);
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
