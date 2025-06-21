import SearchForm from "../../components/SearchForm";
import ReusableTable from "../../components/Table";
import Pagination from "../../components/pagination";
import { ExportExcelBtn, UploadBtn } from "../../components/common-components";
import { ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useDevices from "../../lib/hooks/device";
export default function Devices() {
    const navigate = useNavigate();
    const { devices, loading, error, currentPage, totalPages, searchQuery, handleClear, handleSearch } = useDevices();

    const handleRowClick = (row) => {
        navigate(`/device/device-dashboard/${row.id}`);
    }


    return (
        <section className="d-flex flex-column">
            <header className="d-lg-flex align-items-center justify-content-between mb-1">
                <h5 className="text-uppercase">Devices</h5>
                <div className="d-flex gap-2">
                    <SearchForm onSubmit={handleSearch} onClear={handleClear} />
                    <ButtonGroup>
                        <UploadBtn onClick={() => navigate('/devices/upload')} />
                        {/*  <ExportExcelBtn /> */}
                    </ButtonGroup>
                </div>
            </header>
            <ReusableTable
                loading={loading}
                error={error}
                headerColor="#007bff"
                headerTextColor="#fff"
                onRowClick={(row) => handleRowClick(row)}
                SNo={true}
                currentPage={currentPage}
                pageSize={totalPages}
                columns={[
                    { key: 'imeinumber', label: 'IMEI Number', width: 150, align: 'start', textWrap: 'nowrap' },
                    { ket: "latitude", label: "Latitude", width: 100, align: "start" },
                    { key: 'longitude', label: 'Longitude', width: 100, align: 'start' },
                    { key: "simNumber", label: "SIM Number", width: 150, align: "start", textWrap: "nowrap" },
                    { key: "pcbSerialNumber", label: "PCB Serial Number", width: 150, align: "start", textWrap: "nowrap" },
                    { key: "customerName", label: "Customer Name", width: 150, align: "start", textWrap: "nowrap" },
                    { key: "registrationDate", label: "Registration Date", width: 150, align: "start", textWrap: "nowrap" },
                    { key: 'status', label: 'Status', width: 100, align: 'start', textWrap: "nowrap" },
                    { key: 'lastUpdated', label: 'Last Updated', width: 150, align: 'start', textWrap: "nowrap" },]}
                data={devices}
            />
            <div className="ms-auto">
                <Pagination
                    currentPage={currentPage || 0}
                    totalPages={totalPages || 0}
                    onPageChange={(page) => console.log("Change to page:", page)}
                />
            </div>
        </section>
    );
}

