import React, { useState } from 'react';
import { Table, Form, Row, Col, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function Alerts() {
  const alerts = useSelector(state => state.alerts.list);
  const [type, setType] = useState('');

  const filtered = alerts.filter(a => (type ? a.type === type : true));

  return (
    <div>
      <h3 className="mb-4">Alerts</h3>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Select value={type} onChange={e => setType(e.target.value)}>
            <option value="">All Types</option>
            <option value="Warning">Warning</option>
            <option value="Error">Error</option>
          </Form.Select>
        </Col>
      </Row>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Type</th>
            <th>Message</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(alert => (
            <tr key={alert.id}>
              <td>
                <Badge bg={alert.type === 'Error' ? 'danger' : 'warning'}>{alert.type}</Badge>
              </td>
              <td>{alert.message}</td>
              <td>{alert.time}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
