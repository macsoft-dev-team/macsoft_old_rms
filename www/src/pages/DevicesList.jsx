import React, { useState } from 'react';
import { Table, Form, Row, Col, Button, Pagination } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// Mock customer/device data for demonstration
const mockCustomers = {
  1: 'Acme Corp',
  2: 'Globex Inc',
  3: 'Umbrella Ltd',
};

export default function DevicesList() {
  const devices = useSelector(state => state.devices.list).map((d, i) => ({
    ...d,
    id: d.id || i + 1,
    imei: d.imei || `35678901234${(i + 10)}`,
    sim: d.sim || `899110120000${(i + 1000)}`,
    customer: d.customer || mockCustomers[(i % 3) + 1] || '',
    status: d.status || (i % 2 === 0 ? 'Running' : 'Faulty'),
  }));

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Filter by status, IMEI, or customer
  const filtered = devices.filter(d =>
    (status ? d.status === status : true) &&
    (
      d.imei.toLowerCase().includes(search.toLowerCase()) ||
      d.customer.toLowerCase().includes(search.toLowerCase())
    )
  );
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pageCount = Math.ceil(filtered.length / pageSize);

  return (
    <div>
      <h3 className="mb-4">Devices</h3>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Control
            placeholder="Search by IMEI or Customer"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Running">Running</option>
            <option value="Faulty">Faulty</option>
          </Form.Select>
        </Col>
      </Row>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Device ID</th>
            <th>IMEI</th>
            <th>SIM Number</th>
            <th>Customer</th>
            <th>Last Seen</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.map(device => (
            <tr key={device.id}>
              <td>{device.id}</td>
              <td>{device.imei}</td>
              <td>{device.sim}</td>
              <td>{device.customer}</td>
              <td>{device.lastSeen}</td>
              <td>
                <span className={device.status === 'Running' ? 'text-success' : 'text-danger'}>
                  {device.status}
                </span>
              </td>
              <td>
                <Button as={Link} to={`/devices/${device.id}`} size="sm" variant="primary" className="me-1">
                  View
                </Button>
                <Button size="sm" variant="secondary" className="me-1">
                  Assign
                </Button>
                <Button size="sm" variant="warning" className="me-1">
                  Configure
                </Button>
                <Button size="sm" variant="info">
                  Send Cmd
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {[...Array(pageCount)].map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={page === idx + 1}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
}
