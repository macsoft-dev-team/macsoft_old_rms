import { useEffect } from "react";
import Pagination from "../../components/pagination";
import SearchForm from "../../components/SearchForm";
import ReusableTable from "../../components/Table";
import { useSelector, useDispatch } from "react-redux";
// import or create a slice/hook for customers if needed
// import { fetchCustomers } from "../../lib/reducer/customerSlice";
// import useCustomers from "../../lib/hooks/customer";

export default function Customers() {
    // Replace with actual hook or logic for customers
    // const {
    //     customers,
    //     loading,
    //     currentPage,
    //     totalPages,
    //     handleSearch,
    //     handleClear,
    // } = useCustomers();

    // Temporary mock data for demonstration
    const customers = [
        {
            customerId: 'CUST001',
            deviceId: 'SSP-01234',
            name: 'Murugan',
            address:"1234 Kallakurichi, Tamil Nadu, India",
            phone: '8765432109',
            registeredAt: '2024-01-15T09:30:00Z',
            status: 'Active'
        },
        {
            customerId: 'CUST002',
            deviceId: 'SSP-01235',
            name: 'Sundaram',
            address: '5678 Chennai, Tamil Nadu, India',
            phone: '9876543210',
            registeredAt: '2024-02-20T11:45:00Z',
            status: 'Inactive'
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
            registeredAt: new Date(item.registeredAt).toLocaleString(),
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
                    { key: 'customerId', label: 'Customer ID', width: 100, align: 'start', textWrap: 'nowrap' },
                    { key: 'deviceId', label: 'Device ID', width: 100, align: 'start', textWrap: 'nowrap' },
                    { key: 'name', label: 'Name', width: 200, align: 'start', textWrap: 'nowrap' },
                    { key: 'address', label: 'Address', width: 250, align: 'start', textWrap: 'nowrap' },
                    { key: 'phone', label: 'Phone', width: 150, align: 'start', textWrap: 'nowrap' },
                    { key: 'registeredAt', label: 'Registered At', width: 150, align: 'start', textWrap: 'nowrap' },
                    { key: 'status', label: 'Status', width: 100, align: 'start', textWrap: 'nowrap' },
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
