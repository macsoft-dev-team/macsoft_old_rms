 import moment from 'moment';
import { Activity, Clock } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const RecentActivity = ({ recentActivity = [], lastUpdated }) => {
  const formatTime = (dateString) => {
    return moment(dateString).format('HH:mm');
  };

  const getActionColor = (action) => {
    if (!action) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    
    const actionLower = action.toLowerCase();
    return actionLower === 'read' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
  };

  // Show only last 5 activities
  const displayActivities = recentActivity.slice(0, 5);

  return (
    <div className="bg-white flex flex-col dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 h-96">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        <div className="flex items-center space-x-1">
          <Activity className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">{displayActivities.length}</span>
        </div>
      </div>
      
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {displayActivities.length > 0 ? (
          displayActivities.map((activity, index) => (
            <div 
              key={activity.id || index}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getActionColor(activity.action)}`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                    {activity.title || 'N/A'} 
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {activity.message || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 ml-2">
                <Clock className="w-3 h-3 mr-1" />
                {activity.createdAt ? formatTime(activity.createdAt) : '--'}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No activity</p>
          </div>
        )}
      </div>
      
      {displayActivities.length > 0 && (
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Updated: {lastUpdated ? moment(lastUpdated).format('MMM DD, HH:mm') : moment().format('MMM DD, HH:mm')}</span>
            <NavLink to="/notifications">
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              All
            </button>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
