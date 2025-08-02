import { CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import Input from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import Select from '../../../components/ui/select';
import { Send } from 'lucide-react';

const CommandPanel = ({
    selectedDevice,
    setSelectedDevice,
    commandType,
    commandValue,
    setCommandValue,
}) => {
    const commands = [
        { key: 'INAC', value: '0' },
        { key: 'OPAC', value: '1' },
        { key: 'SET_FREQ', value: '2' },
        { key: 'MTRPM', value: '3' },
        { key: 'RES', value: '4' }
    ]
    console.log('CommandPanel devices:', selectedDevice);

    return (
        <div>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Send Command</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                        Select Device
                    </label>
                    <Input
                        type="search"
                        placeholder="All Devices"
                        value={selectedDevice}
                        onChange={e => setSelectedDevice(e.target.value)}
                        className="w-full dark:bg-gray-800 dark:text-white border-blue-400 dark:border-blue-500"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                        Command Type
                    </label>
                    <table className="w-full text-sm border border-blue-400 dark:border-blue-500 rounded-md overflow-hidden">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="text-left px-3 py-2 font-semibold text-gray-700 dark:text-gray-200">Address</th>
                                <th className="text-left px-3 py-2 font-semibold text-gray-700 dark:text-gray-200">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commands.map(type => (
                                <tr key={type.value} className="even:bg-gray-50 dark:even:bg-gray-900">
                                    <td className="px-3 py-2 text-gray-800 dark:text-gray-100">{type.key}</td>
                                    <td className="px-3 py-2 text-gray-800 dark:text-gray-100">{type.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {commandType === 'SET_FREQ' && (
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                            Frequency (Hz)
                        </label>
                        <Select
                            value={commandValue}
                            onChange={e => setCommandValue(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-400 dark:border-blue-500 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select frequency...</option>
                            <option value="30">30 Hz</option>
                            <option value="40">40 Hz</option>
                            <option value="50">50 Hz</option>
                            <option value="60">60 Hz</option>
                            <option value="custom">Custom</option>
                        </Select>
                        {commandValue === 'custom' && (
                            <Input
                                type="number"
                                placeholder="Enter custom frequency..."
                                value={commandValue === 'custom' ? '' : commandValue}
                                onChange={(e) => setCommandValue(e.target.value)}
                            />
                        )}
                    </div>
                )}

                {commandType === 'CUSTOM' && (
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                            Custom Command
                        </label>
                        <Select
                            value={commandValue}
                            onChange={e => setCommandValue(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-400 dark:border-blue-500 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select or enter custom command...</option>
                            <option value="REBOOT">Reboot</option>
                            <option value="STATUS">Status</option>
                            <option value="custom">Custom</option>
                        </Select>
                        {commandValue === 'custom' && (
                            <Textarea
                                placeholder="Enter custom command..."
                                value={commandValue === 'custom' ? '' : commandValue}
                                onChange={(e) => setCommandValue(e.target.value)}
                                className="mt-2 w-full px-3 py-2 border border-blue-400 dark:border-blue-500 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}
                    </div>
                )}


            </CardContent>
        </div>
    );
};

export default CommandPanel;
