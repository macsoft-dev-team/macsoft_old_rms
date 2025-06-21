import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const dataRows = [
  { time: '2024-06-01 10:00', value: 12 },
  { time: '2024-06-01 10:10', value: 15 },
  { time: '2024-06-01 10:20', value: 14 },
  { time: '2024-06-01 10:30', value: 16 },
];

const chartData = {
  labels: dataRows.map(r => r.time),
  datasets: [
    {
      label: 'Value',
      data: dataRows.map(r => r.value),
      borderColor: '#0d6efd',
      fill: false,
    },
  ],
};

export default function HistoricalData() {
  return (
    <div>
      <h3 className="mb-4">Historical Data</h3>
      <Card className="mb-4">
        <Card.Body>
          <Line data={chartData} />
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.time}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
