import { Send } from 'lucide-react';
import { CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import Input from '../../../components/ui/input';
 
const CommandPanel = ({
    devices, 
    getDevices,
    setCommands,
    setSelectedDevice
}) => {

    const commands = [
        { address: "00A1", value: "10" },
        { address: "00A2", value: "20" },
        { address: "00A3", value: "30" },
        { address: "00A4", value: "40" }

    ];

     const deviceDataListId = "device-list";

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
                    <div>
                        <Input
                            list={deviceDataListId}
                            type="search"
                            placeholder="All Devices"
                            onChange={(e) => {
                                const value = e.target.value;
                                getDevices(value);
                                if (value === "") {
                                    setCommands([]);
                                    setSelectedDevice(null);
                                }
                            }}
                            className="w-full dark:bg-gray-800 dark:text-white border-blue-400 dark:border-blue-500"
                        />
                        <datalist id={deviceDataListId}>
                            {devices.map((item) => (
                                <option key={item.id} value={item.id}>{item.username}-{item.imeinumber}</option>
                            ))}
                        </datalist>
                    </div>
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
                            {commands.map((type, i) => (
                                <tr key={i + type.value} className="even:bg-gray-50 dark:even:bg-gray-900">
                                    <td className="px-3 py-2 text-gray-800 dark:text-gray-100">{type.address}</td>
                                    <td className="px-3 py-2 text-gray-800 dark:text-gray-100">{type.value}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </CardContent>
        </div>
    );
};

export default CommandPanel;
