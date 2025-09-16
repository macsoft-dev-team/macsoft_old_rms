import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { CheckCheck, FileText, MessageSquare, Tag, Eye, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationFormDialog({
  open,
  onOpenChange,
  notification,
  mode,
  onCancel,
  onMarkAsRead,
}) {
  const isView = mode === 'view';

  if (!isView) {
    return null; // Only support view mode for notifications
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md dark:bg-black/10 dark:text-blue-100">
        <DialogHeader>
          <DialogTitle className="text-lg dark:text-blue-100">
            View Notification
          </DialogTitle>
        </DialogHeader>

        {notification && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className='pt-4'
            >
              <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Title
              </label>
              <div className="flex items-center gap-3 px-4 py-3">
                <motion.div 
                  className="text-gray-800 dark:text-blue-100 text-base font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {notification.title || 'No title'}
                </motion.div>
              </div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-500" />
                Message
              </label>
              <div className="px-4 py-3 ">
                <motion.div 
                  className="text-gray-800 dark:text-blue-100 text-base leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {notification.message || 'No message'}
                </motion.div>
              </div>
            </motion.div>

            {/* Type and Status */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-500" />
                  Type
                </label>
                <div className="flex items-center gap-3 px-4 py-3">
                  <motion.div 
                    className="text-gray-800 dark:text-blue-100 text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {notification.type || '--'}
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-orange-500" />
                  Status
                </label>
                <div className="flex items-center gap-3 px-4 py-3">
                  <motion.div 
                    className={`flex items-center gap-2 text-base font-medium ${
                      notification.isRead ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                    }`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    {notification.isRead ? (
                      <>
                        <CheckCheck className="w-4 h-4" />
                        Read
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" />
                        Unread
                      </>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Created At */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-base font-medium text-gray-700 dark:text-blue-100 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Created At
              </label>
              <div className="flex items-center gap-3 px-4 py-3">
                <motion.div 
                  className="text-gray-800 dark:text-blue-100 text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'Unknown date'}
                </motion.div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div 
              className="flex justify-end space-x-2 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {!notification.isRead && onMarkAsRead && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={() => {
                      onMarkAsRead(notification);
                      onCancel && onCancel();
                    }}
                    className="text-base bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white transition-colors duration-200"
                  >
                    <CheckCheck className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  onClick={onCancel} 
                  className="text-base hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors duration-200"
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}