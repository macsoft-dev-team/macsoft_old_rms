import DeviceMetricCard from './DeviceMetricCard';
import { deviceDashboardMetrics, deviceMetricsGrouped } from '../../../lib/constants/deviceDashboardMetrics';
import NNewDeviceMetricCard from './newCard';
 
const MetricsGrid = ({ device }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {deviceMetricsGrouped.map((group, idx) => (
      <NNewDeviceMetricCard 
        key={group.mainTitle + idx} 
        mainTitle={group.mainTitle}
        icon={group.icon}
        index={idx}
        pairs={group.pairs.map(pair => ({
          ...pair,
          value: device[pair.key]
        }))}
      />
    ))}

 {/*    {deviceDashboardMetrics.map((metric, idx) => (
      <DeviceMetricCard
        key={metric.title + idx}
        icon={metric.icon}
        title={metric.title}
        value={device[metric.key]}
        unit={metric.unit}
       />
    ))} */}
  </div>
);

export default MetricsGrid;

 
