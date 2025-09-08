import { MotionDiv } from '.';
import { useForm } from 'react-hook-form';
import Select from '../../../components/ui/select';
import { Search } from 'lucide-react';
import Input from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';


const MappingsFilters = ({
    manufacturers,
    setFilter,
    user
}) => {
    const navigate =useNavigate ();
    const { register, handleSubmit, setValue, watch, reset } = useForm({
        defaultValues: {
            search: '',
            status: '',
            manufacturer: '',
        },
    });
    const onSubmit = (data) => {
        navigate('/mappings');
        const _data ={}
        if (data.search) _data.search = data.search;
        if (data.status && data.status !== '') _data.status = data.status;
        if (data.manufacturer && data.manufacturer !== '') _data.manufacturer = data.manufacturer;
        setFilter(_data);
    };

    const handleClear = () => {
        reset({ search: '', status: '', manufacturer: '' });
        setFilter({ search: '', status: '', manufacturer: '' });
    };

    return (
        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex flex-col gap-4 w-full sm:w-auto">
                    <div className="flex items-center relative">
                        <Search className="absolute left-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <Input
                            className="pl-10 pr-3 w-full min-w-80"
                            type="text"
                            placeholder="Search devices . . ."
                            {...register('search')}
                        />
                    </div>
                </div>
                <div className="w-full sm:w-48">
                    <Select
                        options={[
                            { value: '', label: 'All Devices' },
                            { value: 1, label: 'Online' },
                            { value: 0, label: 'Offline' },
                            { value: 2, label: 'Fault' },
                        ]}
                        name={'status'}
                        value={watch('status')}
                        onChange={e => setValue('status', e.target.value)}
                        placeholder="All Status"
                        className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    />
                </div>
                {(user?.role === 'MACSOFT_ADMIN' || user?.role === 'MACSOFT_USER') && (
                    <div className="w-full sm:w-48">
                        <Select
                            options={[{ value: '', label: 'All Manufacturers' }, ...manufacturers.map(m => ({ value: m.id, label: m.name }))]}
                            name={'manufacturer'}
                            value={watch('manufacturer')}
                            onChange={e => setValue('manufacturer', e.target.value)}
                            placeholder="All Manufacturers"
                            className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-600"
                        />
                    </div>
                )}
                <div className="flex flex-row gap-2 items-center h-full">
                    <Button type="submit" variant="primary">
                        Apply Filters
                    </Button>
                    <Button type="button" variant="outline" onClick={handleClear}>
                        Clear
                    </Button>
                </div>
            </form>
        </MotionDiv>
    );
};

export default MappingsFilters;
