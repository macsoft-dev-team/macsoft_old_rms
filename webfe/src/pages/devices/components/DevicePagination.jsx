import { ChevronLeft, ChevronRight } from 'lucide-react';

const DevicePagination = ({ page, totalPages, onPrev, onNext }) => (
    <div className="flex xl:ms-auto items-center xl:justify-center gap-2 w-full xl:w-max">
        <button
            onClick={onPrev}
            disabled={page === 1}
            className="w-9 h-9 flex items-center focus:ring-2 focus:ring-blue-600 justify-center rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
        >
            <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="px-4 py-1 w-full text-center tracking-wider rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white text-sm font-medium select-none">
            Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
        </span>
        <button
            onClick={onNext}
            disabled={page === totalPages}
            className="w-9 h-9 flex items-center focus:ring-2 focus:ring-blue-600  justify-center rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
        >
            <ChevronRight className="w-5 h-5" />
        </button>
    </div>
);

export default DevicePagination;
