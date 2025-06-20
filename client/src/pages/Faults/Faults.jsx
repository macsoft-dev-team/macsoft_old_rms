import { useEffect } from "react";
import Pagination from "../../components/pagination";
import SearchForm from "../../components/SearchForm";
import ReusableTable from "../../components/Table";
import { useSelector, useDispatch } from "react-redux";
// import or create a slice/hook for faults if needed
// import { fetchFaults } from "../../lib/reducer/faultSlice";
// import useFaults from "../../lib/hooks/fault";

export default function Faults() {
    // Replace with actual hook or logic for faults
    // const {
    //     faults,
    //     loading,
    //     currentPage,
    //     totalPages,
    //     handleSearch,
    //     handleClear,
    // } = useFaults();

    // Temporary mock data for demonstration
    const faults = [
        {
            imeinumber: '123456789012345',
            faultCode: 'F001',
            description: 'Battery failure detected',
            occurredAt: '2023-10-01T12:00:00Z',
            severity: 'High'
        },
        {
            imeinumber: '987654321098765',
            faultCode: 'F002',
            description: 'GPS signal lost',
            occurredAt: '2023-10-02T14:30:00Z',
            severity: 'Medium'
        }
    ];
    const loading = false;
    const currentPage = 1;
    const totalPages = 1;
    const handleSearch = () => { };
    const handleClear = () => { };

    const transFormdata = (data) => {
        return data.map((item) => ({
            ...item,
            occurredAt: new Date(item.occurredAt).toLocaleString(),
        }));
    };
    return (
        <section className="d-flex flex-column">
            <header className="d-lg-flex align-items-center justify-content-between mb-1">
                <h5 className="text-uppercase">Faults</h5>
                <div className="d-flex gap-2">
                    <SearchForm onSearch={handleSearch} onClear={handleClear} />
                </div>
            </header>
            <ReusableTable
                headerColor="#007bff"
                headerTextColor="#fff"
                loading={loading}
                onRowClick={(row) => console.log(row)}
                SNo={true}
                currentPage={currentPage}
                pageSize={totalPages}
                columns={[
                    { key: 'imeinumber', label: 'IMEI Number', width: 50, align: 'start', textWrap: 'nowrap' },
                    { key: 'faultCode', label: 'Fault Code', width: 100, align: 'start', textWrap: 'nowrap' },
                    { key: 'description', label: 'Description', width: 300, align: 'start', textWrap: 'nowrap' },
                    { key: 'occurredAt', label: 'Occurred At', width: 150, align: 'start', textWrap: 'nowrap' },
                    { key: 'severity', label: 'Severity', width: 100, align: 'start', textWrap: 'nowrap' },
                ]}
                data={faults ? transFormdata(faults) : []}
            />
            <div className="ms-auto">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => console.log("Change to page:", page)}
                />
            </div>
        </section>
    );
}
