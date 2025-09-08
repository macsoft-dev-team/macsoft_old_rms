import { Download, Edit, Settings, Trash2 } from "lucide-react";
import TitleHead from "../../components/TitleHead";
import { Button } from "../../components/ui/button";
 import UploadModal from "./components/UploadModal";
import { MappingsFilters, MotionDiv, MappingsBadge, MappingsGrid } from "./components";
import { useMapping } from "../../hooks/useMapping";
import { useManufacturer } from "../../hooks/useManufacturer";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
 
export default function Mappings() {
    const { mappings, mapping, loading, filter, currentPage, totalPages, fetchMappings, setFilter, uploadMapping, setMapping, onPageChange, setMode, mode } = useMapping();
    const { manufacturers, fetchManufacturers } = useManufacturer();
    const { user } = useAuth();
    const handleImportClick = () => {
        setMode("upload");
    };
    const safeManufacturers = Array.isArray(manufacturers) ? manufacturers : [];

    useEffect(() => {
        fetchMappings({ skip: 0, take: 12, filter });
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
            <MappingsFilters
                setFilter={setFilter}
                manufacturers={safeManufacturers}
                user={user} /> 
            <MappingsBadge />
            <MappingsGrid />

            <UploadModal
                open={mode === "upload"}
                onOpenChange={setMode}
                uploadDevice={uploadMapping}
            />
        </section>
    );
}