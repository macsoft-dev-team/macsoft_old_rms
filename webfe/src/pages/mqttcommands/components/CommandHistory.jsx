
import { useForm } from 'react-hook-form';
import { CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { MessageSquare, ArrowBigRight, RefreshCw } from 'lucide-react';
import Input from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import Select from '../../../components/ui/select';
import { dateF } from '../../../lib/constants/variables';
import { useSelector } from 'react-redux';


function CommandActionRow({ device, postCommand, setCommand }) {
    if (!device) return null;
    const { register, handleSubmit, watch, reset } = useForm({
        defaultValues: {
            action: 'READ',
            address: '',
            value: '',
        },
    });
    const action = watch('action');
    const options = [
        { value: 'READ', label: 'Read' },
        { value: 'WRITE', label: 'Write' },
    ];

    const onSubmit = (data) => {
        if (device && device.id) {
            data.deviceId = device.id;
        }
        if (data.deviceId) {
            setCommand({
                id: Date.now(),
                ...data,
                createdAt: Date.now(),
                response: '...',
            });
            postCommand(data);
        }
        console.log('Command submitted:', data);
        reset({ ...data, value: '', address: '' });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="hover:bg-gray-50 transition-colors flex lg:flex-row flex-col lg:items-center gap-2 py-2">
            <Select
                placeholder='Select Action'
                className='!w-40'
                options={options}
                value={action}
                onChange={e => {
                }}
                {...register('action')}
            />
            <div>
                <Input placeholder="Enter address" disabled={false} {...register('address')} />
            </div>
            {action !== 'READ' && (
                <div>
                    <Input className={` ${action === 'READ' ? '!bg-gray-100' : ''}`} placeholder={action === 'READ' ? 'Response' : 'Write Value'} disabled={action === 'READ'} {...register('value')} />
                </div>
            )}
            <div>
                <Button type="submit" className='w-full lg:w-auto flex items-center justify-center gap-2'>
                    <span className='  uppercase'>send</span>
                    <ArrowBigRight className="w-5 h-5" />
                </Button>
            </div>
        </form>
    );
}

const CommandHistory = ({
    device,
    command,
    postCommand,
    onPageChange,
    currentPage,
    totalPages,
    setCommand,
    loading,
    error,
    onRefresh
}) => {
    const { commands } = useSelector((state) => state.command);

    return (
        <div>
            <CardHeader>
                <CardTitle className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5" />
                        <span>Command History</span>
                    </div>
                    {onRefresh && (
                        <Button
                            type="button"
                            variant="outline"
                            size="small"
                            onClick={onRefresh}
                            disabled={loading}
                            className="flex items-center space-x-2 ms-auto"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CommandActionRow device={device} postCommand={postCommand} setCommand={setCommand} />
                <div className="space-y-3 max-h-96 overflow-y-auto border relative border-gray-200 dark:border-gray-700 rounded-md">
                    <table className="min-w-full divide-y divide-gray-200 border table-auto border-gray-200 rounded-lg ">
                        <thead className='bg-gray-100 dark:bg-gray-800 sticky top-0 z-10'>
                            <tr>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600 bg-gray-100 dark:bg-gray-800 sticky top-0 z-20">Timestamp</th>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600 bg-gray-100 dark:bg-gray-800 sticky top-0 z-20">Action</th>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600 bg-gray-100 dark:bg-gray-800 sticky top-0 z-20">Address</th>
                                <th className="px-3 py-2 text-left text-sm font-semibold text-gray-600 bg-gray-100 dark:bg-gray-800 sticky top-0 z-20">Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-3 py-2 text-sm text-gray-500 text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : commands.length > 0 ? commands.map((_command, i) => {
                                return (
                                    <tr
                                        key={_command.id + i}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => setCommand && setCommand(_command)}
                                    >
                                        <td className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap">{dateF(_command.createdAt)}</td>
                                        <td className="px-3 py-2 text-sm text-gray-700">{_command.action}</td>
                                        <td className="px-3 py-2 font-mono text-sm text-gray-700">{_command.address}</td>
                                        <td className="px-3 py-2 text-sm text-gray-700">
                                            {_command.action === 'READ' || _command.action === 'READ' || _command.action === 'READ' ? '-' : (_command.value || '-')}
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan={5} className="px-3 py-2 text-sm text-gray-500 text-center">No commands found

                                        <br />
                                        <blockquote className='text-xs text-gray-400 italic py-2'>
                                            Note: Selected device commands will appear here after being sent to the device.
                                            <br />
                                            <small className='text-xs text-gray-400 italic'>
                                                Select a device or send a command.
                                            </small>
                                        </blockquote>

                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center py-2 px-3">
                            <Button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => onPageChange && onPageChange(currentPage - 1)}
                                className="mr-2"
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                type="button"
                                disabled={currentPage === totalPages}
                                onClick={() => onPageChange && onPageChange(currentPage + 1)}
                                className="ml-2"
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </div>
    );
};

export default CommandHistory;
