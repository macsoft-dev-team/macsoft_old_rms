import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function Dashboard() {
  // Example counts
  const summary = [
    { title: 'Total Devices', value: 24 },
    { title: 'Running', value: 18 },
    { title: 'Faulty', value: 3 },
    { title: 'Not Reporting', value: 3 },
  ];

  // Last 24-hour activity (dummy data)
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const activityData = {
    labels: hours,
    datasets: [
      {
        label: 'Active Devices',
        data: [10,12,13,15,14,16,18,20,21,22,23,22,21,20,19,18,17,16,15,14,13,12,11,10],
        borderColor: '#0d6efd',
        backgroundColor: 'rgba(13,110,253,0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div>
      <h3 className="mb-4">Dashboard</h3>
      <Row className="mb-4">
        {summary.map((item, idx) => (
          <Col key={idx} md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text className="fs-2 fw-bold">{item.value}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Last 24-hour Device Activity</Card.Title>
              <Line data={activityData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Device Locations</Card.Title>
              {/* Static map image, replace src with your own if needed */}
              <div className="text-center">
                <img
                  src="https://maps.googleapis.com/maps/api/staticmap?center=37.773972,-122.431297&zoom=3&size=300x200&markers=color:red|37.773972,-122.431297|34.052235,-118.243683|40.712776,-74.005974"
                  alt="Device Locations Map"
                  style={{ width: '100%', borderRadius: 8 }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
