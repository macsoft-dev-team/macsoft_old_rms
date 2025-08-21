import { motion, AnimatePresence } from "motion/react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) {
            return;
        }
        onPageChange(page);
    };

    const renderPaginationItems = () => {
        let items = [];
        let start = 1;
        let end = totalPages;
        if (totalPages > 5) {
            if (currentPage <= 3) {
                end = 5;
            } else if (currentPage >= totalPages - 2) {
                start = totalPages - 4;
            } else {
                start = currentPage - 2;
                end = currentPage + 2;
            }
        }
        for (let number = start; number <= end; number++) {
            items.push(
                <motion.button
                    key={number}
                    id={`pagination-item-${number}`}
                    onClick={() => handlePageChange(number)}
                    className={`px-3 py-1 transition-colors duration-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 select-none text-sm font-medium ${
                        number === currentPage
                            ? 'bg-blue-500 text-white shadow-lg scale-110'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'
                    }`}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    aria-current={number === currentPage ? "page" : undefined}
                >
                    {number}
                </motion.button>
            );
        }
        return items;
    };

    return (
        <div className="flex justify-end items-center py-2 select-none">
            <motion.button
                id="pagination-first"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: currentPage === 1 ? 1 : 1.08 }}
                whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                aria-label="First Page"
            >
                &#171;
            </motion.button>
            <motion.button
                id="pagination-prev"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: currentPage === 1 ? 1 : 1.08 }}
                whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                aria-label="Previous Page"
            >
                &#8249;
            </motion.button>
            <AnimatePresence mode="wait">
                {renderPaginationItems()}
            </AnimatePresence>
            <motion.button
                id="pagination-next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.08 }}
                whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                aria-label="Next Page"
            >
                &#8250;
            </motion.button>
            <motion.button
                id="pagination-last"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.08 }}
                whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                aria-label="Last Page"
            >
                &#187;
            </motion.button>
        </div>
    );
};

export default Pagination;