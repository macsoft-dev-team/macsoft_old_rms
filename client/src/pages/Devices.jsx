import SearchForm from "../components/SearchForm";
import ReusableTable from "../components/Table";
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { clearSearchQuery, fetchDevices, setSearchQuery } from "../lib/reducer/deviceSlice";
import Pagination from "../components/pagination";
export default function Devices() {
    const dispatch = useDispatch();
    const { devices, loading, error, currentPage, totalPages, searchQuery } = useSelector((state) => state.device);
    const handleClear = () => {
        // Clear search filter logic here
        dispatch(clearSearchQuery());
    }
    const handleSearch = (data) => {
        // Search logic here, e.g., dispatch an action to filter devices
        dispatch(setSearchQuery(data.filter));
    }

    useEffect(() => {
        // Fetch devices when the component mounts
        dispatch(fetchDevices({ page: currentPage, size: 10, filter: searchQuery }));
    }, [ searchQuery]);

    return (
        <section className="d-flex flex-column">
            <header className="d-lg-flex align-items-center justify-content-between mb-1">
                <h5 className="text-uppercase">Devices</h5>
                <SearchForm onSubmit={handleSearch} onClear={handleClear} />
            </header>
            <ReusableTable   
                headerColor="#007bff"        
                headerTextColor="#fff"   
                onRowClick={(row) => console.log(row)}
                onEdit
                onDelete
                onView={(row) => console.log("View device:", row)}
                columns={[
                    { key: 'id', label: 'ID', width: 10, align: 'start', textWrap: 'nowrap' },
                    { key: 'host', label: 'Host', width: 150, align: 'start', textWrap: 'nowrap' },
                    { key: 'imeinumber', label: 'IMEI Number', width: 150, align: 'start', textWrap: 'nowrap' },
                    { key: 'password', label: 'Password', width: 100, align: 'center', textWrap: 'nowrap' },
                    { key: 'port', label: 'Port', width: 80, align: 'center', textWrap: 'nowrap' },
                    { key: 'pubTopic', label: 'Pub Topic', width: 200, align: 'start', textWrap: 'nowrap' },
                    { key: 'subTopic', label: 'Sub Topic', width: 200, align: 'start', textWrap: 'nowrap' },
                    { key: 'username', label: 'Username', width: 120, align: 'start', textWrap: 'nowrap' }
                ]}
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