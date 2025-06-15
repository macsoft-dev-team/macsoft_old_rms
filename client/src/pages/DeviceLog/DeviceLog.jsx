 import Pagination from "../../components/pagination";
import SearchForm from "../../components/SearchForm";
import ReusableTable from "../../components/Table";

export default function DeviceLog() {
    return (
        <section className="d-flex flex-column">
            <header className="d-lg-flex align-items-center justify-content-between mb-1">
                <h5 className="text-uppercase">Devices</h5>
                <div className="d-flex gap-2">
                    <SearchForm  />
                </div>
            </header>
            <ReusableTable
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
                data={[]}
            />
            <div className="ms-auto">
                <Pagination
                    currentPage={0}
                    totalPages={0}
                    onPageChange={(page) => console.log("Change to page:", page)}
                />
            </div>
         </section>
    );
}