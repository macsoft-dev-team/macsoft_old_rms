import { Download } from "lucide-react";
import TitleHead from "../../components/TitleHead";
import { Button } from "../../components/ui/button";
import { MotionDiv } from "../devices/components";
import UploadModal from "./components/UploadModal";
import { DevicesFilters } from "./components";
import { useMapping } from "../../hooks/useMapping";
import { useManufacturer } from "../../hooks/useManufacturer";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import Pagination from "../../components/Pagination";

export default function Mappings() {
    const { mappings, mapping, loading, filter, currentPage, totalPages, fetchMappings, setFilter, uploadMapping, setMapping, setMode, mode } = useMapping();
    const { manufacturers, fetchManufacturers } = useManufacturer();
    const { user } = useAuth();
    const handleImportClick = () => {
        setMode("upload");
    };
    const safeMap = Array.isArray(mappings) ? mappings : [];
    const safeManufacturers = Array.isArray(manufacturers) ? manufacturers : [];

    useEffect(() => {
        fetchMappings({ skip: 0, take: 10, filter });
        fetchManufacturers({ skip: 0, take: null, filter: {} });
    }, [fetchMappings, filter]);

    return (
        <section className="space-y-6">
            <TitleHead title="SNA configurations Mapping" description="Map your SNA configurations to their respective devices">
                <MotionDiv
                    className="flex gap-3 *:uppercase *:text-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <Button variant="outline" onClick={handleImportClick} >
                        <Download className="w-4 h-4 mr-2" />
                        {loading ? <span className='hidden lg:inline'>Importing...</span> : <span>Import SNA Details</span>}
                    </Button>
                </MotionDiv>
            </TitleHead>
            <DevicesFilters
                setFilter={setFilter}
                manufacturers={safeManufacturers}
                user={user} />
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-sm shadow-sm border border-gray-200 dark:border-gray-700">
                <table className="w-full min-w-[700px]">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                            <th className="p-3 border-r border-slate-200 dark:border-slate-600 text-left">IMEI Number</th>
                            <th className="p-3 border-r border-slate-200 dark:border-slate-600 text-left">Host</th>
                            <th className="p-3 border-r border-slate-200 dark:border-slate-600 text-left">Port</th>
                            <th className="p-3 border-r border-slate-200 dark:border-slate-600 text-left">Username</th>
                            <th className="p-3 border-r border-slate-200 dark:border-slate-600 text-left">Password</th>
                            <th className="p-3 border-r border-slate-200 dark:border-slate-600 text-left">Pub Topic Data</th>
                            <th className="p-3 border-slate-200 dark:border-slate-600 text-left">subtopic</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="p-6 text-center text-gray-500 dark:text-gray-300">Loading...</td>
                            </tr>
                        ) : safeMap.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-6 text-center text-gray-500 dark:text-gray-300">No data found</td>
                            </tr>
                        ) : (
                            safeMap.map((item, i) => (
                                <tr className="border-b border-slate-100 dark:border-slate-700" key={item.imeinumber || i}>
                                    <td className="p-3 font-mono text-slate-900 dark:text-slate-100">{item.imeinumber}</td>
                                    <td className="p-3 text-slate-900 dark:text-slate-100">{item.snahost}</td>
                                    <td className="p-3 text-slate-900 dark:text-slate-100">{item.snaport}</td>
                                    <td className="p-3 text-slate-900 dark:text-slate-100">{item.snausername}</td>
                                    <td className="p-3 text-slate-900 dark:text-slate-100">{item.snapassword}</td>
                                    <td className="p-3 text-slate-900 dark:text-slate-100">{item.snapubTopicData}</td>
                                    <td className="p-3 text-slate-900 dark:text-slate-100">{item.snasubTopicCmd}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination with page number navigation */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={page => onPageChange(page)}
            />
            <UploadModal
                open={mode === "upload"}
                onOpenChange={setMode}
                uploadDevice={uploadMapping}
            />
        </section>
    );
}