import { Copy, Check } from "lucide-react";
import { useMapping } from "../../../hooks/useMapping";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function MappingsGrid() {
    const { mappings } = useMapping();
    const safeMap = Array.isArray(mappings) ? mappings : [];
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = async (device) => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(device, null, 2));
            setCopiedId(device.id);
            setTimeout(() => setCopiedId(null), 1200);
        } catch (err) {
            // Optionally handle error
        }
    };

    if (!safeMap || safeMap.length === 0) {
        return (<div>No mappings found</div>);
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {safeMap.map((device) => (
                <div
                    key={device.id}
                    className="bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-200 hover:shadow-2xl hover:shadow-blue-200/40 dark:hover:shadow-blue-900/40 hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                    {/* Header row with IMEI and actions */}
                    <div className="flex justify-between bg-gray-200/25 items-center p-2 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                            IMEI - {device.imeinumber}
                        </h3>
                        <div className="flex gap-2">
                            <button
                                className="p-1 hover:text-blue-600 relative"
                                onClick={() => handleCopy(device)}
                                title={copiedId === device.id ? "Copied!" : "Copy device JSON"}
                                style={{ minWidth: 24, minHeight: 24 }}
                            >
                                <AnimatePresence initial={false} mode="wait">
                                    {copiedId === device.id ? (
                                        <motion.span
                                            key="check"
                                            initial={{ scale: 0, rotate: -90, opacity: 0 }}
                                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                            exit={{ scale: 0, rotate: 90, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                            className="text-green-600 flex items-center justify-center"
                                        >
                                            <Check size={18} />
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="copy"
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                            className="flex items-center justify-center"
                                        >
                                            <Copy size={16} />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 text-nowrap overflow-hidden text-sm text-gray-700 p-3 px-5 dark:text-gray-200 *:grid *:lg:grid-cols-3 **:even:col-span-2 **:odd:uppercase">
                        <p>
                            <span className="font-semibold text-gray-800 ">MQTT URL</span>
                            {device.snamqtturl || "Not configured"}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-800 ">Username</span>
                            {device.snamqttusername || "Not configured"}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-800 ">Password</span>
                            {device.snamqttpassword ? "Encrypted" : "Not configured"}
                        </p>
                        <p className="truncate">
                            <span className="font-semibold text-gray-800 ">Pub Topic</span>
                            {device.snamqttpubtopicdata || "Not configured"}
                        </p>
                        <p className="truncate">
                            <span className="font-semibold text-gray-800 ">Sub Topic</span>
                            {device.snamqttsubtopiccmd || "Not configured"}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}