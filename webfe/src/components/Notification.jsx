import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { clearNotification } from '../lib/features/uiSlice';

const Notification = () => {
  const dispatch = useDispatch();
  const { notification } = useSelector((state) => state.ui);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
          text: 'text-green-800 dark:text-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-500 dark:text-green-400',
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
          text: 'text-red-800 dark:text-red-200',
          icon: AlertCircle,
          iconColor: 'text-red-500 dark:text-red-400',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: AlertTriangle,
          iconColor: 'text-yellow-500 dark:text-yellow-400',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-200',
          icon: Info,
          iconColor: 'text-blue-500 dark:text-blue-400',
        };
    }
  };

  const styles = getNotificationStyles(notification.type);
  const Icon = styles.icon;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={`${styles.bg} border ${styles.text} rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-start">
          <Icon className={`w-5 h-5 ${styles.iconColor} mt-0.5 mr-3 flex-shrink-0`} />
          <div className="flex-1">
            {notification.title && (
              <h4 className="font-medium mb-1">{notification.title}</h4>
            )}
            <p className="text-sm">{notification.message}</p>
          </div>
          <button
            onClick={() => dispatch(clearNotification())}
            className={`ml-3 ${styles.iconColor} hover:opacity-70 dark:hover:bg-gray-700 transition-opacity rounded-md p-1`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
