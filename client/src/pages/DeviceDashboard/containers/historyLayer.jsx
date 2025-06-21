import { Form, InputGroup } from "react-bootstrap";
import Pagination from "../../../components/pagination";
import SearchForm from "../../../components/SearchForm";
import ReusableTable from "../../../components/Table";
import { ExportExcelBtn } from "../../../components/common-components";

export default function HistoryLog() {
    const loading = false; // Replace with actual loading state
    const currentPage = 1; // Replace with actual current page state
    const totalPages = 1; // Replace with actual total pages state

    return (
        <section className="d-flex flex-column">
            <header
                className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between mb-1 rounded py-2"
                style={{ gap: '1rem' }}
            >
                <h5 className="text-uppercase mb-2 mb-lg-0 fw-bold letter-spacing-1" style={{ letterSpacing: '1.5px' }}>Device Log</h5>
                <div className="w-lg-auto d-flex flex-column flex-lg-row gap-2 align-items-stretch align-items-lg-center">
                    <InputGroup className="flex-nowrap">
                        <InputGroup.Text className="fw-semibold bg-primary text-white border-0">From</InputGroup.Text>
                        <Form.Control type="date" name="fromDate" size="sm" style={{ minWidth: 100 }} />
                        <InputGroup.Text className="fw-semibold bg-primary text-white border-0">To</InputGroup.Text>
                        <Form.Control type="date" name="toDate" size="sm" style={{ minWidth: 100 }} />
                    </InputGroup>
                    <div className="d-flex flex-row gap-2 align-items-center mt-2 mt-lg-0 ms-lg-2 w-100 w-lg-auto">
                        <SearchForm />
                        <ExportExcelBtn />
                    </div>
                </div>
            </header>
            <ReusableTable
                headerColor="#007bff"
                headerTextColor="#fff"
                loading={loading}
                onRowClick={(row) => console.log(row)}
                columns={[
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