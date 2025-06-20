import Pagination from "../../../components/pagination";
import SearchForm from "../../../components/SearchForm";
import ReusableTable from "../../../components/Table";

export default function HistoryLog() {
    const loading = false; // Replace with actual loading state
    const currentPage = 1; // Replace with actual current page state
    const totalPages = 1; // Replace with actual total pages state

    return (
        <section className="d-flex flex-column py-3">
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
                data={[]}
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