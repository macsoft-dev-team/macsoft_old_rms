import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form } from 'react-bootstrap';

const initialTemplates = [
  { id: 1, name: 'Default', config: 'Interval=10s;Threshold=75' },
  { id: 2, name: 'High Sensitivity', config: 'Interval=5s;Threshold=60' },
];

export default function ConfigTemplates() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [show, setShow] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({ name: '', config: '' });

  const handleShow = idx => {
    setEditIdx(idx);
    setForm(idx !== null ? templates[idx] : { name: '', config: '' });
    setShow(true);
  };

  const handleSave = () => {
    if (editIdx !== null) {
      const updated = templates.slice();
      updated[editIdx] = { ...updated[editIdx], ...form };
      setTemplates(updated);
    } else {
      setTemplates([...templates, { ...form, id: Date.now() }]);
    }
    setShow(false);
  };

  const handleDelete = idx => {
    setTemplates(templates.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <h3 className="mb-4">Configuration Templates</h3>
      <Button className="mb-3" onClick={() => handleShow(null)}>Add Template</Button>
      <Card>
        <Card.Body>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Config</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {templates.map((tpl, idx) => (
                <tr key={tpl.id}>
                  <td>{tpl.name}</td>
                  <td>{tpl.config}</td>
                  <td>
                    <Button size="sm" variant="secondary" onClick={() => handleShow(idx)}>Edit</Button>{' '}
                    <Button size="sm" variant="danger" onClick={() => handleDelete(idx)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editIdx !== null ? 'Edit' : 'Add'} Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Config</Form.Label>
              <Form.Control
                value={form.config}
                onChange={e => setForm(f => ({ ...f, config: e.target.value }))}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
