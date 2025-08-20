import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Building2, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { NavLink } from 'react-router-dom';

const ManufacturerCard = ({ manufacturer, devices, statusCounts, index, handleDeviceFilter, onEdit }) => (
    <motion.div
        key={manufacturer.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
        <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 dark:bg-gray-900 dark:border-gray-700">
            <CardHeader className="bg-gray-100 text-white bg-gradient-to-r dark:from-blue-900 dark:to-blue-800 dark:text-blue-100">
                <div className="flex items-center space-x-3">
                    <div>
                        <CardTitle className="text-lg uppercase">{manufacturer.name}</CardTitle>
                        <p className="text-gray-400 text-sm dark:text-blue-200">@{manufacturer.username}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 dark:bg-gray-900">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Devices</span>
                        <Badge variant="outline" className="font-semibold dark:border-gray-600 dark:text-gray-200">
                            {devices}
                        </Badge>
                    </div>
                    {devices.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300 flex items-center"><Wifi className="w-4 h-4 text-green-500 mr-1" /> Online</span>
                                <span className="font-medium dark:text-gray-200">{statusCounts.online}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300 flex items-center"><WifiOff className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" /> Offline</span>
                                <span className="font-medium dark:text-gray-200">{statusCounts.offline}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300 flex items-center"><AlertCircle className="w-4 h-4 text-red-500 mr-1" /> Fault</span>
                                <span className="font-medium dark:text-gray-200">{statusCounts.fault}</span>
                            </div>
                        </div>
                    )}
                    <div className="border-t border-gray-200 pt-4 dark:border-gray-700 flex justify-between items-center">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Associated Devices</h4>
                        {devices.length > 0 && <div className='text-gray-600 dark:text-gray-300'>{devices.length}</div>}
                    </div>
                                        <div className="flex space-x-2">
                                                <NavLink to={`/manufacturer/${manufacturer.id}`} className="flex-1">
                                                        <Button
                                                                onClick={() => handleDeviceFilter(manufacturer.id)}
                                                                variant="outline"
                                                                className="flex-1 group-hover:bg-blue-50 dark:group-hover:bg-blue-900 transition-colors"
                                                        >
                                                                <Building2 className="w-4 h-4 mr-2" />
                                                                View Devices
                                                        </Button>
                                                </NavLink>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => onEdit && onEdit(manufacturer)}
                                                    className="flex-1"
                                                >
                                                    Edit
                                                </Button>
                                        </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);


export default ManufacturerCard;
