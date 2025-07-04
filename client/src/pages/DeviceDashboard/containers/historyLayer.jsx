import { Form, InputGroup, Modal, Button } from "react-bootstrap";
import Pagination from "../../../components/pagination";
import SearchForm from "../../../components/SearchForm";
import ReusableTable from "../../../components/Table";
import { ExportExcelBtn } from "../../../components/common-components";
import React, { useState } from "react";
import useDeviceLogs from "../../../lib/hooks/deviceLog";

export default function HistoryLog() {
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().slice(0, 10);

    // State for date filters
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);

    // Add state for pagination
    const [page, setPage] = useState(1);

    // State for modal and selected row
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // Use the hook with date filters and page
    const {
        deviceLogs,
        loading,
        currentPage,
        totalPages,
        handleClear,
        handleSearch,
    } = useDeviceLogs({ fromDate, toDate, page });

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
                        <Form.Control
                            type="date"
                            name="fromDate"
                            size="sm"
                            style={{ minWidth: 100 }}
                            value={fromDate}
                            onChange={e => setFromDate(e.target.value)}
                        />
                        <InputGroup.Text className="fw-semibold bg-primary text-white border-0">To</InputGroup.Text>
                        <Form.Control
                            type="date"
                            name="toDate"
                            size="sm"
                            style={{ minWidth: 100 }}
                            value={toDate}
                            onChange={e => setToDate(e.target.value)}
                        />
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
                onRowClick={(row) => {
                    setSelectedRow(row);
                    setShowModal(true);
                }}
                columns={[
                    { key: 'serial', label: 'S.No', width: 70, align: 'center', textWrap: 'nowrap' },
                    { key: 'messageType', label: 'Message Type', width: 150, align: 'start', textWrap: 'nowrap' },
                    { 
                        key: 'receivedAt', 
                        label: 'Timestamp', 
                        width: 180, 
                        align: 'start', 
                        textWrap: 'nowrap',
                        dataType: 'date'
                    },
                    { key: 'lpm', label: 'LPM', width: 100, align: 'start', textWrap: 'nowrap' },
                    { key: 'dcAmps', label: 'DC Amps', width: 100, align: 'start', textWrap: 'nowrap' },
                    { key: 'dcVolts', label: 'DC Volts', width: 100, align: 'start', textWrap: 'nowrap' },
                    { key: 'pvVolts', label: 'PV Volts', width: 100, align: 'start', textWrap: 'nowrap' },
                    { key: 'pvCurrent', label: 'PV Current', width: 100, align: 'start', textWrap: 'nowrap' },
                    { key: 'totalDischarge', label: 'Total Discharge', width: 130, align: 'start', textWrap: 'nowrap' },
                ]}
                data={
                    (deviceLogs || []).map((row, idx) => ({
                        serial: ((currentPage || page) - 1) * 10 + idx + 1,
                        ...row,
                    }))
                }
            />
            <div className="ms-auto">
                <Pagination
                    currentPage={currentPage || page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Raw Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                        {selectedRow ? JSON.stringify(selectedRow, null, 2) : ""}
                    </pre>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
}