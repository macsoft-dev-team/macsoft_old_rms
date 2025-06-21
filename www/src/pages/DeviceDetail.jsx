import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Card, Table, Form, Button, Row, Col, Dropdown } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const logs = [
  { time: '2024-06-01 10:00', message: 'Started' },
  { time: '2024-06-01 10:05', message: 'Temperature high' },
  { time: '2024-06-01 10:10', message: 'Normal' },
];

const config = [
  { key: 'Interval', value: '10s' },
  { key: 'Threshold', value: '75' },
];

const templates = [
  { id: 1, name: 'Default', values: { Interval: '10s', Threshold: '75' } },
  { id: 2, name: 'High Sensitivity', values: { Interval: '5s', Threshold: '60' } },
];

const historicalData = [
  { time: '2024-06-01 09:00', value: 12 },
  { time: '2024-06-01 10:00', value: 15 },
  { time: '2024-06-01 11:00', value: 14 },
  { time: '2024-06-01 12:00', value: 16 },
];

export default function DeviceDetail() {
  const { id } = useParams();
  const [tab, setTab] = useState('live');
  const [cmdType, setCmdType] = useState('read');
  const [cmdAddr, setCmdAddr] = useState('');
  const [cmdValue, setCmdValue] = useState('');
  const [cmdResp, setCmdResp] = useState('');
  const [histStart, setHistStart] = useState('');
  const [histEnd, setHistEnd] = useState('');
  const [appliedConfig, setAppliedConfig] = useState(config);
  const [selectedTpl, setSelectedTpl] = useState(null);

  // Live chart data (dummy)
  const liveChartData = {
    labels: Array.from({ length: 10 }, (_, i) => `T-${10 - i}`),
    datasets: [
      {
        label: 'Metric',
        data: [10, 12, 11, 15, 14, 13, 16, 15, 17, 16],
        borderColor: '#0d6efd',
        fill: false,
      },
    ],
  };

  // Status info (dummy)
  const statusInfo = {
    state: 'Running',
    lastSeen: '2024-06-01 12:00',
    battery: '80%',
    signal: 'Good',
  };

  // Historical chart data (dummy)
  const histChartData = {
    labels: historicalData.map(r => r.time),
    datasets: [
      {
        label: 'Value',
        data: historicalData.map(r => r.value),
        backgroundColor: '#0d6efd',
        borderColor: '#0d6efd',
        fill: false,
      },
    ],
  };

  // Filtered logs for date filter (dummy, not implemented)
  const filteredLogs = logs;

  // Export Excel (dummy)
  const handleExport = () => {
    alert('Exported to Excel (mock)');
  };

  // Command submit
  const handleCommand = e => {
    e.preventDefault();
    setCmdResp(`Mock response for ${cmdType.toUpperCase()} ${cmdAddr}${cmdType === 'write' ? ` = ${cmdValue}` : ''}`);
  };

  // Config edit
  const handleConfigChange = (idx, val) => {
    setAppliedConfig(cfg =>
      cfg.map((c, i) => (i === idx ? { ...c, value: val } : c))
    );
  };

  // Apply template
  const handleApplyTemplate = tplId => {
    const tpl = templates.find(t => t.id === tplId);
    if (tpl) {
      setAppliedConfig(Object.entries(tpl.values).map(([key, value]) => ({ key, value })));
      setSelectedTpl(tplId);
    }
  };

  return (
    <div>
      <h3 className="mb-4">Device Detail #{id}</h3>
      <Tabs activeKey={tab} onSelect={setTab} className="mb-3">
        <Tab eventKey="live" title="Live Data">
          <Card>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <Line data={liveChartData} />
                </Col>
                <Col md={4}>
                  <h5>Status Info</h5>
                  <Table size="sm" borderless>
                    <tbody>
                      <tr><td>State</td><td>{statusInfo.state}</td></tr>
                      <tr><td>Last Seen</td><td>{statusInfo.lastSeen}</td></tr>
                      <tr><td>Battery</td><td>{statusInfo.battery}</td></tr>
                      <tr><td>Signal</td><td>{statusInfo.signal}</td></tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="logs" title="Historical Logs">
          <Card>
            <Card.Body>
              <Row className="mb-3">
                <Col md={3}>
                  <Form.Control
                    type="date"
                    value={histStart}
                    onChange={e => setHistStart(e.target.value)}
                    placeholder="Start date"
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="date"
                    value={histEnd}
                    onChange={e => setHistEnd(e.target.value)}
                    placeholder="End date"
                  />
                </Col>
                <Col md={3}>
                  <Button variant="success" onClick={handleExport}>Export Excel</Button>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Table>
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log, idx) => (
                        <tr key={idx}>
                          <td>{log.time}</td>
                          <td>{log.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <Bar data={histChartData} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="commands" title="Command Console">
          <Card>
            <Card.Body>
              <Form onSubmit={handleCommand}>
                <Row className="mb-2">
                  <Col md={3}>
                    <Form.Select value={cmdType} onChange={e => setCmdType(e.target.value)}>
                      <option value="read">Read</option>
                      <option value="write">Write</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Control
                      placeholder="Address"
                      value={cmdAddr}
                      onChange={e => setCmdAddr(e.target.value)}
                    />
                  </Col>
                  {cmdType === 'write' && (
                    <Col md={3}>
                      <Form.Control
                        placeholder="Value"
                        value={cmdValue}
                        onChange={e => setCmdValue(e.target.value)}
                      />
                    </Col>
                  )}
                  <Col md={3}>
                    <Button type="submit" variant="primary">Send</Button>
                  </Col>
                </Row>
              </Form>
              {cmdResp && <div className="mt-3"><b>Response:</b> {cmdResp}</div>}
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="config" title="Configuration">
          <Card>
            <Card.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <Dropdown onSelect={handleApplyTemplate}>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      {selectedTpl
                        ? templates.find(t => t.id === selectedTpl)?.name
                        : 'Apply Template'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {templates.map(tpl => (
                        <Dropdown.Item key={tpl.id} eventKey={tpl.id}>
                          {tpl.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
              <Table>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {appliedConfig.map((c, idx) => (
                    <tr key={idx}>
                      <td>{c.key}</td>
                      <td>
                        <Form.Control
                          value={c.value}
                          onChange={e => handleConfigChange(idx, e.target.value)}
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="primary">Save Config</Button>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
