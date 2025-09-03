import { MotionDiv } from '.';
import { Badge } from '../../../components/ui/badge';
import { DevicePagination } from '.';
import { useDevice } from '../../../hooks/useDevice';
import Pagination from '../../../components/ui/pagination';

const DevicesBadge = () => {
    const { devices, currentPage, totalPages, onPageChange } = useDevice();
    const count = devices ? devices.length : 0;
    return (
        <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="xl:flex grid items-center gap-2"
        ><div className="flex items-center gap-2"
        >
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700">
                    📊 Sorted by most recent data
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-300">
                    ( {count} devices shown )
                </span>
            </div>
          {/*   <DevicePagination
                page={currentPage}
                totalPages={totalPages}
                onPrev={() => onPageChange(currentPage - 1)}
                onNext={() => onPageChange(currentPage + 1)}
            /> */}
            <div className='ms-auto'>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
            </div>
        </MotionDiv>

    );
}

export default DevicesBadge;
