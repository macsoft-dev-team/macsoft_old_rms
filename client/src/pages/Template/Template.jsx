import { useEffect } from "react";
import Pagination from "../../components/pagination";
import SearchForm from "../../components/SearchForm";
import ReusableTable from "../../components/Table";
import useTemplates from "../../lib/hooks/template";
import { AddBtn, EditBtn, UploadBtn } from "../../components/common-components";
import { ButtonGroup, Card, Col, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TemplateFormModal from "./components/form";
import UploadForm from "./components/uploadForm";

export default function Template() {
    const {
        isUpload,
        templates,
        template,
        loading,
        currentPage,
        totalPages,
        handleSearch,
        handleClear,
        handleModal,
        fetchTemplate,
        handleUploadModal,
        setTemplate
    } = useTemplates();


    const handleEdit = (row) => {
        handleModal(true);
    };

    const handleSelect = (row) => {
        fetchTemplate(row.id);
    };

    const handleCreate = () => {
        handleModal(true);
        setTemplate(null);
    };

    const handleUpload = () => {
        handleUploadModal(true);
    };

    console.log(isUpload, "isUpload");


    return (
        <Row className="g-2 m-0">
            <Col lg={6} className="">
                <section className="d-flex flex-column">
                    <header className="d-lg-flex align-items-center justify-content-between mb-1">
                        <h5 className="text-uppercase">Template</h5>
                        <div className="d-flex gap-2">
                            <SearchForm onSubmit={handleSearch} onClear={handleClear} />
                            <ButtonGroup>
                                <AddBtn onClick={handleCreate}  />
                                <UploadBtn onClick={handleUpload} />
                                {/*  <ExportExcelBtn /> */}
                            </ButtonGroup>
                        </div>
                    </header>
                    <ReusableTable
                        headerColor="#007bff"
                        headerTextColor="#fff"
                        loading={loading}
                        onRowClick={(row) => handleSelect(row)}
                        columns={[
                            { key: 'name', label: 'Name', width: 150, align: 'start', textWrap: 'nowrap' },
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
                    <TemplateFormModal />
                    <UploadForm />
                </section>
            </Col>
            <Col lg={6}>
                <section>
                    <header className="d-flex align-items-center justify-content-between mb-1">
                        <h5 className="text-uppercase">{template?.name ? 
                           ""
                        : "No Template Selected"}</h5>
                    </header>
                    {template?.items && (
                        <Card className="h-100">
                                <Card.Header className="text-uppercase d-flex justify-content-between align-items-center">
                                   Template Details
                                <EditBtn name={template.name} onClick={() => handleEdit(template)} />
                                </Card.Header>
                            <Card.Body>
                                <div>
                                    <p><strong>Name</strong> {template.name}</p>
                                    Template Configurations
                                    <Table bordered className="mt-3 align-middle">
                                        <thead className="table-light text-uppercase">
                                            <tr>
                                                <th>Address</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {template && template?.items && template?.items.map((config, index) => (
                                                <tr key={index}>
                                                    <td>{config.address}</td>
                                                    <td>{config.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </Card>
                    
                    )}
                </section>
            </Col>
        </Row>
    );
}
