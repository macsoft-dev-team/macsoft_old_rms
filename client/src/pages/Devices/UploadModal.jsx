import { useState } from "react";
import { Modal, Button, ButtonGroup, Table, Col, Form, Spinner, Badge } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Pagination from "../../components/pagination";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { readExcelAsJSON } from "../../components/common-components";
import * as yup from "yup";
import { uploadDevices } from "../../lib/reducer/deviceSlice";
export default function UploadModal(props) {
    const listSize = 10;
    const [file, setFile] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();
    const { show, setShow } = props;
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(uploadSchema),
        defaultValues: {
            items: [],
        },
    });

    const { fields, append, replace } = useFieldArray({
        control,
        name: "items",
    });

    // Handle file upload
    const handleUpload = async (e) => {

        e.preventDefault();
        setLoading(true);
        try {
            const json = await readExcelAsJSON(e.target.files[0]);
            if (json) {
                const formattedJson = json.map(order => {
                    const formattedOrder = {};
                    for (const key in order) {
                        const formattedKey = key
                            .replace(/\s+/g, '_')
                            .replace(/\./g, '')
                            .replace(/\"()"/, "")
                            .replace(/\(HP\)/g, '')
                            .toLowerCase();
                        formattedOrder[formattedKey] = order[key];
                    }
                    return formattedOrder;
                });

                setFile(formattedJson); // For pagination UI
                reset({ items: formattedJson }); // Register all for validation
            }
        } catch (error) {
            toast.error("Failed to read the file");
        } finally {
            setLoading(false);
        }
    };

    // Handle modal close
    const handleClose = () => {
        setShow(false);
        setFile(null);
        setSubmitting(false);
        reset();
    };

    // Handle form submission
    const onSubmit = (data) => {
        // Dispatch the upload action

        if (!data.items || data.items.length === 0) {
            toast.error("No data to submit");
            return;
        }
        setSubmitting(true);
        dispatch(uploadDevices({ data: data.items })).then((originalPromiseResult) => {
            if (originalPromiseResult.error) {
                toast.error("Error uploading devices");
                setSubmitting(false);
            } else {
                setSubmitting(false);
                toast.success(originalPromiseResult.payload.message);
                setShow(false);
                setFile(null);
                reset();
            }
        });
    };
    const errorCount =
        Array.isArray(errors?.items)
            ? errors.items.filter((item) => Object.keys(item).length > 0).length
            : 0;
    return (
        <Modal fullscreen scrollable show={show} onHide={handleClose} backdrop="static" centered>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton={!submitting}>
                    <Modal.Title className="d-flex justify-content-between align-items-center w-100">
                        <div>
                            Upload File
                        </div>
                        <Badge className="me-5" bg="danger">{errorCount && `(Error count - ${errorCount})`}</Badge>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {file?.length > 0 && !submitting && !loading ? (
                        <>

                            <Table bordered className="text-nowrap">
                                <thead>
                                    <tr className="table-dark text-nowrap">
                                        {Object.keys(file[0]).map((key) => (
                                            <th className="text-uppercase" key={key}>{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields
                                        .slice((currentPage - 1) * listSize, currentPage * listSize)
                                        .map((row, index) => {
                                            const globalIndex = (currentPage - 1) * listSize + index;
                                            return (
                                                <tr key={globalIndex} className={errors?.items?.[globalIndex] ? "table-danger" : ""}>
                                                    {Object.keys(file[globalIndex] || {}).map((key) => (
                                                        <td key={key}>
                                                            <Controller
                                                                control={control}
                                                                name={`items[${globalIndex}].${key}`}
                                                                defaultValue={row[key] ?? ""}
                                                                render={({ field }) => (
                                                                    <>
                                                                        <input
                                                                            {...field}
                                                                            value={field.value ?? ""} // <== FIX HERE
                                                                            onChange={(e) => field.onChange(e.target.value)}
                                                                        />
                                                                    </>
                                                                )}
                                                            />

                                                            {errors?.items?.[globalIndex]?.[key] && (
                                                                <div className="text-danger">{errors.items[globalIndex][key].message}</div>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                </tbody>


                            </Table>

                        </>
                    ) : submitting ? (
                        <Col className="d-flex h-100 align-items-center justify-content-center">Submitting <Spinner size="sm" className="mx-2" animation="border" variant="primary" /></Col>
                    ) : loading ? (
                        <Col className="d-flex h-100 align-items-center justify-content-center">Loading <Spinner size="sm" className="mx-2" animation="border" variant="primary" /></Col>
                    ) : (
                        <input type="file" onChange={handleUpload} id="fileUpload" />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {file?.length > 0 && !submitting && !loading && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(file?.length / listSize)}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    )}
                    <ButtonGroup>
                        <Button disabled={!file || submitting} variant="success" type="submit" >
                            Upload
                        </Button>

                        <Button variant="secondary" disabled={submitting} onClick={handleClose}>
                            Close
                        </Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

const uploadSchema = yup.object().shape({
    items: yup.array().of(
        yup.object().shape({
            imeinumber: yup.string().required("IMEI Number is required"),
            host: yup.string().required("Host is required"),
            port: yup.number().required("Port is required").positive().integer(),
            username: yup.string().required("Username is required"),
            password: yup.string().required("Password is required"),
            pubtopic: yup.string().required("Pub Topic is required"),
            subtopic: yup.string().required("Sub Topic is required"),

        })
    )
});