import { X } from "lucide-react";
 
function Overlay({ open, onClose, title, children, className = "", ...rest }) {
    if (!open) return null;

    return (
        <section className="absolute top-14 z-50 start-0 h-[calc(100vh-3.5rem)] w-full bg-black/10 dark:bg-black/60 p-2 flex">
            <aside className={`lg:w-3/5 xl:w-1/3 w-full rounded-xl h-full bg-white dark:bg-gray-900 ms-auto overflow-hidden ${className}`} {...rest}>
                <header className="p-3 xl:p-5 pb-0 border-b border-gray-300 dark:border-gray-700 flex items-center">
                    <h1 className="text-xl tracking-wider font-bold capitalize text-gray-900 dark:text-gray-100">
                        {title}
                    </h1>
                    <button
                        type="button"
                        onClick={onClose}
                        className="ms-auto cursor-pointer focus:ring-2 ring-1 text-gray-500 dark:text-gray-300 focus:text-red-500 ring-gray-300 dark:ring-gray-700 focus:ring-red-400 rounded-lg p-2 text-2xl"
                        aria-label="Close overlay"
                    >
                        <X size={16} />
                    </button>
                </header>
                <div className="p-5 dark:bg-gray-900 dark:text-gray-100">
                    {children}
                </div>
            </aside>
        </section>
    );
}

export default Overlay;