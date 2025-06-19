import { useEffect } from "react";
import Pagination from "../../components/pagination";
import SearchForm from "../../components/SearchForm";
import ReusableTable from "../../components/Table";
import useTemplates from "../../lib/hooks/template";

export default function Template() {
    const {
        templates,
        loading,
        currentPage,
        totalPages,
        handleSearch,
        handleClear,
    } = useTemplates();

 
    return (
        <section className="d-flex flex-column">
            <header className="d-lg-flex align-items-center justify-content-between mb-1">
                <h5 className="text-uppercase">Template</h5>
                <div className="d-flex gap-2">
                    <SearchForm onSearch={handleSearch} onClear={handleClear} />
                </div>
            </header>
            <ReusableTable
                headerColor="#007bff"
                headerTextColor="#fff"
                loading={loading}
                onRowClick={(row) => console.log(row)}
                columns={[
                    { key: 'name', label: 'Name', width: 150, align: 'start', textWrap: 'nowrap' },
                    { key: 'description', label: 'Description', width: 300, align: 'start', textWrap: 'nowrap' },
                    { key: 'createdAt', label: 'Created At', width: 150, align: 'start', textWrap: 'nowrap' },
                ]}
                data={templates || []}
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
