import { CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { ArrowBigRight, MessageSquare } from 'lucide-react';
import Input from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

const CommandLive = (props) => {
    return (
        <div>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Command Live</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600">Operation</th>
                                <td className="px-3 py-2 font-mono text-sm text-gray-700">input</td>

                               </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-2 text-sm text-gray-700">Read</td>
                                <td className="px-3 py-2 text-sm text-gray-700"><Input placeholder="Enter command" /></td>
                                <td className="px-1 py-2 text-sm text-gray-700">
                                    <Button>
                                        <ArrowBigRight className="w-5 h-5" />
                                    </Button>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-2 text-sm text-gray-700">Value/Res</td>
                                <td className="px-3 py-2 text-sm text-gray-700">0</td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-2 text-sm text-gray-700">Write</td>
                                <td className="ps-3 py-2 text-sm text-gray-700"><Input placeholder="Enter address" /></td>
                                <td className="px-1 py-2 text-sm text-gray-700"><Input placeholder="Enter value" /></td>
                                <td className="px-1 py-2 text-sm text-gray-700">
                                    <Button>
                                        <ArrowBigRight className="w-5 h-5" />
                                    </Button>
                                </td>
                             </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-2 text-sm text-gray-700">Value/Res</td>
                                <td className="px-3 py-2 text-sm text-gray-700">1</td>
                            </tr>
                          
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </div>
    );
};

export default CommandLive;
