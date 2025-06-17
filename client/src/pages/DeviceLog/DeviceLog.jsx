import { useEffect } from "react";
import Pagination from "../../components/pagination";
import SearchForm from "../../components/SearchForm";
import ReusableTable from "../../components/Table";
import { useSelector, useDispatch } from "react-redux";
import { fetchDeviceLogs } from "../../lib/reducer/deviceLogSlice";

export default function DeviceLog() {
    const dispatch = useDispatch();
    const { deviceLogs, loading, currentPage, totalPages } = useSelector((state) => state.deviceLog);

    useEffect(() => {
        dispatch(fetchDeviceLogs({ page: currentPage, take: 10, filter: '' }));
    }, [dispatch, currentPage]);

    const transFormdata = (data) => {
        return data.map((item) => ({
            ...item,
            receivedAt: new Date(item.receivedAt).toLocaleString(),
        }));
    };
    return (
        <section className="d-flex flex-column">
            <header className="d-lg-flex align-items-center justify-content-between mb-1">
                <h5 className="text-uppercase">Device Log</h5>
                <div className="d-flex gap-2">
                    <SearchForm />
                </div>
            </header>
            <ReusableTable
                headerColor="#007bff"
                headerTextColor="#fff"
                loading={loading}
                onRowClick={(row) => console.log(row)}
                columns={[
                    { key: 'imeinumber', label: 'IMEI Number', width: 50, align: 'start', textWrap: 'nowrap' },
                    { key: 'receivedAt', label: 'Received At', width: 150, align: 'start', textWrap: 'nowrap' },
                    { key: 'messageType', label: 'Message Type', width: 150, align: 'start', textWrap: 'nowrap' },
                    { key: 'payload', label: 'Payload', width: 400, align: 'start', textWrap: 'nowrap' },
                ]}
                data={deviceLogs ? transFormdata(deviceLogs) : []}
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