import SearchForm from "../../components/SearchForm";
import ReusableTable from "../../components/Table";
import { useEffect,useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { clearSearchQuery, fetchDevices, setSearchQuery } from "../../lib/reducer/deviceSlice";
import Pagination from "../../components/pagination";
import { ExportExcelBtn, UploadBtn } from "../../components/common-components";
import { ButtonGroup } from "react-bootstrap";
import UploadModal from "./UploadModal";
export default function Devices() {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const { devices, loading, error, currentPage, totalPages, searchQuery } = useSelector((state) => state.device);
    const handleClear = () => {
         dispatch(clearSearchQuery());
    }
    const handleSearch = (data) => {
         dispatch(setSearchQuery(data.filter));
    }

    useEffect(() => {
         dispatch(fetchDevices({ page: currentPage, size: 10, filter: searchQuery }));
    }, [ searchQuery]);

    return (
        <section className="d-flex flex-column">
            <header className="d-lg-flex align-items-center justify-content-between mb-1">
                <h5 className="text-uppercase">Devices</h5>
                <div className="d-flex gap-2">
                    <SearchForm onSubmit={handleSearch} onClear={handleClear} />
                    <ButtonGroup>
                        <UploadBtn onClick={() => setShow(true)} />
                       {/*  <ExportExcelBtn /> */}
                    </ButtonGroup>
                </div>
            </header>
            <ReusableTable    
                loading={loading}
                error={error}
                headerColor="#007bff"        
                headerTextColor="#fff"   
                onRowClick={(row) => console.log(row)}
                columns={[
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
            <UploadModal show={show} setShow={setShow} />
        </section>
     );
}

