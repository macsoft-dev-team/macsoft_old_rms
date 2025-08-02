import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { MessageSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const CommandHistory = ({ messages, getStatusConfig }) => {
    return (
        <div>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Command History</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr>
                                 <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600">Address</th>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600">Value</th>
                                 <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600">Response</th>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {messages.map((message) => { 
                                return (
                                    <tr key={message.id} className="hover:bg-gray-50 transition-colors">
                                        
                                        <td className="px-3 py-2 font-mono text-sm text-gray-700">{message.command}</td>
                                        <td className="px-3 py-2 text-sm text-gray-700">{message.value}</td>
                                        <td className="px-3 py-2 text-sm text-gray-700">{message.device}</td>
                                        <td className="px-3 py-2 text-sm text-gray-700">{message.response}</td>
                                        <td className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap">{new Date(message.timestamp).toLocaleString()}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </div>
    );
};

export default CommandHistory;
