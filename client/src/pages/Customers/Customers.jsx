import Pagination from "../../components/pagination";
import SearchForm from "../../components/SearchForm";
import ReusableTable from "../../components/Table";
import useCustomers from "../../lib/hooks/customer";
 
export default function Customers() {
     const {
        customers,
        loading,
        currentPage,
        totalPages,
        handleSearch,
        handleClear,
    } = useCustomers();


    const transFormdata = (data) => {
        return data.map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt).toLocaleString(),
        }));
    };
    return (
        <section className="d-flex flex-column">
            <header className="d-lg-flex align-items-center justify-content-between mb-1">
                <h5 className="text-uppercase">Customers</h5>
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
                    { key: 'deviceId', label: 'Device ID', width: 100, align: 'start', textWrap: 'nowrap' },
                    { key: 'name', label: 'Name', width: 200, align: 'start', textWrap: 'nowrap' },
                    { key: 'address', label: 'Address', width: 250, align: 'start', textWrap: 'nowrap' },
                    { key: 'phone', label: 'Phone', width: 150, align: 'start', textWrap: 'nowrap' },
                    { key: 'createdAt', label: 'Created At', width: 150, align: 'start', textWrap: 'nowrap' },
                 ]}
                data={customers ? transFormdata(customers) : []}
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
