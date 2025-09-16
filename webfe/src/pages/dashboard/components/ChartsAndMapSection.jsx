import DevicesMap from './DevicesMap';
import RecentActivity from './RecentActivity';

const ChartsAndMapSection = ({ deviceLocations, recentActivity, lastUpdated }) => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
    <div className="xl:col-span-2">
      <DevicesMap deviceLocations={deviceLocations} />
    </div>
    <div className="min-h-96 max-h-96">
      <RecentActivity recentActivity={recentActivity} lastUpdated={lastUpdated} />
    </div>
  </div>
);

export default ChartsAndMapSection;

