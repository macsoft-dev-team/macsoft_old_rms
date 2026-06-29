import { Download, Plus, Edit2, Send } from "lucide-react";
import TitleHead from "../../components/TitleHead";
import { Button } from "../../components/ui/button";
import { MotionDiv } from "../devices/components";
import UploadModal from "./components/UploadModal";
import { DevicesFilters, SnaMappingModal } from "./components";
import { useMapping } from "../../hooks/useMapping";
import { useManufacturer } from "../../hooks/useManufacturer";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { useToast } from "../../components/ui/toast";

export default function Mappings() {
    const { 
        mappings, 
        loading, 
        filter, 
        currentPage, 
        totalPages, 
        fetchMappings, 
        setFilter, 
        uploadMapping, 
        setMode, 
        mode,
        onPageChange,
        createMapping,
        updateMapping,
        publishMapping
    } = useMapping();
    const { manufacturers, fetchManufacturers } = useManufacturer();
    const { user } = useAuth();
    const { addToast } = useToast();

    const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
    const [selectedMapping, setSelectedMapping] = useState(null);
    const [publishingImei, setPublishingImei] = useState(null);

    const handleImportClick = () => {
        setMode("upload");
    };

    const handleCreateClick = () => {
        setSelectedMapping(null);
        setIsCreateEditModalOpen(true);
    };

    const handleEditClick = (item) => {
        setSelectedMapping(item);
        setIsCreateEditModalOpen(true);
    };

    const handlePublishClick = async (imei) => {
        setPublishingImei(imei);
        try {
            await publishMapping(imei);
            addToast({
                title: "Success",
                description: `SNA mapping details published to device ${imei} successfully.`,
                variant: "success"
            });
        } catch (err) {
            addToast({
                title: "Error",
                description: err.message || "Failed to publish SNA mapping details",
                variant: "destructive"
            });
        } finally {
            setPublishingImei(null);
        }
    };

    const handleSaveMapping = async (data, shouldPublish = false) => {
        try {
            if (selectedMapping) {
                // Edit mode
                await updateMapping(selectedMapping.imeinumber, data);
                addToast({
                    title: "Success",
                    description: "SNA mapping updated successfully",
                    variant: "success"
                });
            } else {
                // Create mode
                await createMapping(data);
                addToast({
                    title: "Success",
                    description: "SNA mapping created successfully",
                    variant: "success"
                });
            }
            if (shouldPublish) {
                try {
                    await publishMapping(data.imeinumber);
                    addToast({
                        title: "Success",
                        description: `SNA mapping details published to device ${data.imeinumber} successfully.`,
                        variant: "success"
                    });
                } catch (publishErr) {
                    addToast({
                        title: "Publish Failed",
                        description: publishErr.message || "Failed to publish SNA mapping details",
                        variant: "destructive"
                    });
                }
            }
            fetchMappings({ skip: currentPage, take: 10, filter });
        } catch (err) {
            addToast({
                title: "Error",
                description: err.message || "Failed to save SNA mapping",
                variant: "destructive"
            });
            throw err;
        }
    };

    const parseUrl = (url) => {
        if (!url) return { host: "--", port: "--" };
        try {
            let tempUrl = url;
            if (!url.includes("://")) {
                tempUrl = "mqtt://" + url;
            }
            const parsed = new URL(tempUrl);
            return {
                host: parsed.hostname || url,
                port: parsed.port || (parsed.protocol === "mqtts:" || parsed.protocol === "https:" ? "8883" : "1883")
            };
        } catch (e) {
            return { host: url, port: "--" };
        }
    };

    const safeMap = Array.isArray(mappings) ? mappings : [];
    const safeManufacturers = Array.isArray(manufacturers) ? manufacturers : [];

    useEffect(() => {
        fetchMappings({ skip: 1, take: 10, filter });
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
                    <Button onClick={handleCreateClick} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600">
                        <Plus className="w-4 h-4 mr-2" />
                        <span>Create SNA Mapping</span>
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
                            <th className="p-3 border-r border-slate-200 dark:border-slate-600 text-left">Client ID</th>
                            <th className="p-3 border-r border-slate-200 dark:border-slate-600 text-left">Password</th>
                            <th className="p-3 border-r border-slate-200 dark:border-slate-600 text-left">Pub Topic Data</th>
                            <th className="p-3 border-r border-slate-200 dark:border-slate-600 text-left">subtopic</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="p-6 text-center text-gray-500 dark:text-gray-300">Loading...</td>
                            </tr>
                        ) : safeMap.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="p-6 text-center text-gray-500 dark:text-gray-300">No data found</td>
                            </tr>
                        ) : (
                            safeMap.map((item, i) => {
                                const { host, port } = parseUrl(item.snamqtturl);
                                return (
                                    <tr className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors" key={item.imeinumber || i}>
                                        <td className="p-3 font-mono text-slate-900 dark:text-slate-100 font-semibold">{item.imeinumber}</td>
                                        <td className="p-3 text-slate-900 dark:text-slate-100">{host}</td>
                                        <td className="p-3 text-slate-900 dark:text-slate-100">{port}</td>
                                        <td className="p-3 text-slate-900 dark:text-slate-100">{item.snamqttusername || "--"}</td>
                                        <td className="p-3 text-slate-900 dark:text-slate-100">{item.snamqttclientid || "--"}</td>
                                        <td className="p-3 text-slate-900 dark:text-slate-100 font-mono text-xs">{item.snamqttpassword ? "••••••••" : "--"}</td>
                                        <td className="p-3 text-slate-900 dark:text-slate-100 text-xs">{item.snamqttpubtopicdata || "--"}</td>
                                        <td className="p-3 text-slate-900 dark:text-slate-100 text-xs">{item.snamqttsubtopiccmd || "--"}</td>
                                        <td className="p-3 text-slate-900 dark:text-slate-100">
                                            <div className="flex gap-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleEditClick(item)} 
                                                    className="h-8 px-2 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 dark:border-gray-600"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                                                    Edit
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination with page number navigation */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
            <UploadModal
                open={mode === "upload"}
                onOpenChange={setMode}
                uploadDevice={uploadMapping}
            />
            <SnaMappingModal
                open={isCreateEditModalOpen}
                onOpenChange={setIsCreateEditModalOpen}
                mapping={selectedMapping}
                onSave={handleSaveMapping}
            />
        </section>
    );
}