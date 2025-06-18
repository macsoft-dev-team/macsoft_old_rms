import { useEffect, useState } from "react";
import { Modal, Button, ButtonGroup, Table, Col, Form, Spinner, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "../../components/pagination";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { paginateSlicer, readExcelAsJSON, usePagination } from "../../components/common-components";
import * as yup from "yup";
import { fetchDevices, uploadDevices } from "../../lib/reducer/deviceSlice";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

export default function UploadModal() {
    const listSize = 10;
    const navigate = useNavigate();
    const { devices } = useSelector((state) => state.device);
    const [file, setFile] = useState(null);
    const { currentPage, onPageChange } = usePagination(1);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState("All");
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        resolver: yupResolver(uploadSchema),
        defaultValues: {
            existingItems: [],
            newItems: [],
            items: [],
        },
    });

    const { fields, remove } = useFieldArray({ control, name: "items" });

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const json = await readExcelAsJSON(e.target.files[0]);
            if (json) {
                const formattedJson = json.map((order, index) => {
                    const formattedOrder = {};
                    for (const key in order) {
                        const formattedKey = key.replace(/\s+/g, '_').replace(/\./g, '').replace(/"\(\)/, "").replace(/\(HP\)/g, '').toLowerCase();
                        formattedOrder[formattedKey] = order[key];
                    }
                    return { ...formattedOrder, id: `${Date.now()}_${index}` };
                });

                const _existingDevices = formattedJson.map((item) => {
                    const match = devices.find(device => device.imeinumber === item.imeinumber);
                    if (match) {
                        const diffs = {};
                        for (const key in item) {
                            if (item[key] !== match[key]) {
                                diffs[key] = true;
                            }
                        }
                        return { ...item, _type: "existing", _diffs: diffs };
                    } else {
                        return { ...item, _type: "new", _diffs: {} };
                    }
                });

                setFile(_existingDevices);
                reset({ items: _existingDevices });
            }
        } catch (error) {
            toast.error("Failed to read the file");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setSubmitting(false);
        reset({ items: [] });
        navigate('/devices');
    };

    const onSubmit = (data) => {
        if (!data.items || data.items.length === 0) {
            toast.error("No data to submit");
            return;
        }
        setSubmitting(true);
        dispatch(uploadDevices({ data: data.items })).then((originalPromiseResult) => {
            if (originalPromiseResult.error) {
                toast.error("Error uploading devices");
            } else {
                toast.success(originalPromiseResult.payload.message);
                setFile(null);
                navigate('/devices');
            }
            setSubmitting(false);
        });
    };

    const filteredItems = fields.filter(item => selectedType === "All" || item._type === selectedType.toLowerCase());

    const errorCount = Array.isArray(errors?.items) ? errors.items.filter((item) => Object.keys(item).length > 0).length : 0;
    const existingCount = filteredItems.filter(item => item._type === "existing").length;
    const newCount = filteredItems.filter(item => item._type === "new").length;

    useEffect(() => {
        dispatch(fetchDevices({ page: null, size: null, filter: "" }));
    }, [dispatch]);

    return (
        <Modal fullscreen scrollable show={true} onHide={handleClose} backdrop="static" centered>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton={!submitting}>
                    <Modal.Title className="d-flex justify-content-between align-items-center w-100">
                        <div>Upload File</div>
                        <div className="d-flex gap-1 fs-6 ms-auto">
                            <Badge bg="success">New Device <span className="px-2">{newCount && `(Count - ${newCount})`}</span></Badge>
                            <Badge bg="warning" text="dark">Changed Existing <span className="px-2">{existingCount && `(Count - ${existingCount})`}</span></Badge>
                            <Badge bg="danger">Validation Error <span className="px-2">{errorCount && `(Error count - ${errorCount})`}</span></Badge>
                        </div>
                        <div className="d-flex gap-2 px-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={()=>{reset({ items: [] }); setFile(null); setSelectedType("All"); }}
                        >
                            Clear Filters
                        </Button>
                        <Form.Group>
                            <Form.Select disabled={!file} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                                <option value="All">All</option>
                                <option value="New">New</option>
                                <option value="Existing">Existing</option>
                            </Form.Select>
                        </Form.Group>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!file && (
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload File</Form.Label>
                            <Form.Control type="file" accept=".xlsx, .xls, .csv" onChange={handleUpload} disabled={submitting || loading} />
                        </Form.Group>
                    )}

                    {file && filteredItems.length === 0 && !loading && !submitting && (
                        <div className="text-center py-5 text-muted">No items match this filter</div>
                    )}

                    {file && !submitting && !loading && file[0] && filteredItems.length > 0 && (
                        <Table bordered className="text-nowrap">
                            <thead>
                                <tr className="table-dark text-uppercase">
                                    {Object.keys(file[0]).filter(k => !k.startsWith("_")).map((key) => (
                                        <th key={key}>{key}</th>
                                    ))}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginateSlicer(filteredItems, listSize, currentPage).map((row, index) => {
                                    const globalIndex = fields.findIndex(f => f.id === row.id);
                                    const rowErrors = errors?.items?.[globalIndex] || {};
                                    const rowType = row._type;
                                    return (
                                        <tr key={row.id} className={rowType === "new" ? "table-success" : "table-warning"}>
                                            {Object.keys(row).filter(k => !k.startsWith("_")).map((key) => (
                                                <td key={key} className={row._diffs?.[key] ? "bg-warning text-dark" : ""}>
                                                    <Controller
                                                        control={control}
                                                        name={`items[${globalIndex}].${key}`}
                                                        defaultValue={row[key] ?? ""}
                                                        render={({ field }) => field.value}
                                                    />
                                                    {rowErrors?.[key] && (
                                                        <div className="text-danger small">{rowErrors[key].message}</div>
                                                    )}
                                                </td>
                                            ))}
                                            <td className="text-center">
                                                <Button variant="danger" size="sm" onClick={() => remove(globalIndex)}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}

                    {submitting && (
                        <Col className="d-flex h-100 align-items-center justify-content-center">Submitting <Spinner size="sm" className="mx-2" animation="border" variant="primary" /></Col>
                    )}
                    {loading && (
                        <Col className="d-flex h-100 align-items-center justify-content-center">Loading <Spinner size="sm" className="mx-2" animation="border" variant="primary" /></Col>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {file && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(filteredItems.length / listSize)}
                            onPageChange={(page) => onPageChange(page)}
                        />
                    )}
                    <ButtonGroup>
                        <Button disabled={submitting} variant="success" type="submit">Upload</Button>
                        <Button variant="secondary" disabled={submitting} onClick={handleClose}>Close</Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

const itemSchema = yup.object().shape({
    imeinumber: yup.string().required("IMEI Number is required"),
    host: yup.string().required("Host is required"),
    port: yup.number().required("Port is required").positive().integer(),
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
    pubtopic: yup.string().required("Pub Topic is required"),
    subtopic: yup.string().required("Sub Topic is required"),
});

export const uploadSchema = yup.object().shape({
    items: yup.array().of(itemSchema)
});
