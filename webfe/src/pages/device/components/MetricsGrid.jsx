import DeviceMetricCard from '../../../components/DeviceMetricCard';
import { deviceDashboardMetrics } from '../../../lib/constants/deviceDashboardMetrics';

const MetricsGrid = ({ device }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {deviceDashboardMetrics.map((metric, idx) => (
      <DeviceMetricCard
        key={metric.title + idx}
        icon={metric.icon}
        title={metric.title}
        value={device[metric.key]}
        unit={metric.unit}
        color={metric.color}
      />
    ))}
  </div>
);

export default MetricsGrid;
