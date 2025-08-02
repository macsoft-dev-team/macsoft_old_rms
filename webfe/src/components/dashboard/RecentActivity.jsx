 

import { activities } from '../../data/mockData';

const RecentActivity = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-64 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
      <ul className="space-y-3">
        {activities.map((activity) => (
          <li key={activity.id} className="text-gray-700 dark:text-gray-200">
            <div className="flex items-center justify-between">
              <span>{activity.message}</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
