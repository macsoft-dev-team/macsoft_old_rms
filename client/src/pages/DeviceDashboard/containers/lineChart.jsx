import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register required components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

// Sample log data per hour
const logData = [
  { time: "00:00", logs: 5 },
  { time: "01:00", logs: 2 },
  { time: "02:00", logs: 10 },
  { time: "03:00", logs: 6 },
  { time: "04:00", logs: 3 },
  { time: "05:00", logs: 1 },
  { time: "06:00", logs: 8 },
  { time: "07:00", logs: 12 },
];

export default function LineChart() {
  const data = {
    labels: logData.map((item) => item.time),
    datasets: [
      {
        label: "Logs per Hour",
        data: logData.map((item) => item.logs),
        fill: true,
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        borderColor: "#007bff",
        tension: 0.3,
        pointBackgroundColor: "#007bff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} logs`,
        },
      },
    },
  };

  return (
    <div style={{ height: 300 }}>
      <Line data={data} options={options} />
    </div>
  );
}
