import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import useTemplates from '../../../lib/hooks/template';
import * as XLSX from 'xlsx';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import LocalPagination from './LocalPagination';

export default function UploadForm() {
    const { uploadTemplate, isUpload, handleUploadModal } = useTemplates();
    const { register, handleSubmit, control, reset, setValue, watch } = useForm({
        defaultValues: {
            name: '',
            items: [],
        },
    });

    const { fields, append, replace } = useFieldArray({
        control,
        name: 'items',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(fields.length / pageSize);
    const paginatedFields = fields.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const onSubmit = async (data) => {
        console.log('Final submitted data:', data);
        if (!data.items || data.items.length === 0) {
            toast.error('At least one item is required');
            return;
        }
        try {
            uploadTemplate(data);
        } catch (error) {
            console.error('Error uploading template:', error);
            toast.error('Failed to upload template. Please try again.');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            toast.error('Please select a file');
            return;
        }

        setValue('name', file.name.replace('.xlsx', ''));

        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (!Array.isArray(jsonData) || jsonData.length === 0) {
                toast.error('The Excel file is empty or invalid format');
                return;
            }

            // Reset and append parsed data
            replace(jsonData.map((row) => ({ ...row })));
        };


        reader.onerror = () => {
            toast.error('Error reading file. Please try again.');
        };
        reader.readAsBinaryString(file);
    };
    const handleCancel = () => {
        reset();
        handleUploadModal(false);
    }

    return (
        <Modal show={isUpload} onHide={handleCancel} centered size="lg">
            <Modal.Header className='py-2' closeButton>
                <Modal.Title>Upload Template</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {fields.length === 0 && (
                        <Form.Group>
                            <Form.Control
                                type="file"
                                accept=".xlsx, .xls"
                                id="file"
                                onChange={handleFileUpload}
                                className="form-control"
                            />
                            <Form.Text className="text-muted">
                                Upload your Excel file here.
                            </Form.Text>
                        </Form.Group>
                    )}
                    {fields.length > 0 && (
                        <Form.Group className="my-2">
                            <Form.Label>File Name</Form.Label>
                            <Form.Control
                                type="text"
                                readOnly
                                className="shadow-none"
                                {...register('name')}
                            />
                        </Form.Group>
                    )}

                    {fields.length > 0 && (
                        <>
                            <div className="table-responsive">
                                <Table bordered>
                                    <thead>
                                        <tr className="table-light text-uppercase">
                                            {Object.keys(fields[0])
                                                .filter((key) => key !== 'id')
                                                .map((key, i) => (
                                                    <th key={i}>{key}</th>
                                                ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedFields.map((field, rowIndex) => {
                                            const globalIndex = (currentPage - 1) * pageSize + rowIndex;
                                            return (
                                                <tr key={field.id}>
                                                    {Object.entries(field)
                                                        .filter(([key]) => key !== 'id')
                                                        .map(([key, value], colIndex) => (
                                                            <td key={colIndex}>
                                                                <input
                                                                    readOnly
                                                                    className="form-control form-control-sm border-0 "
                                                                    defaultValue={value}
                                                                    {...register(`items.${globalIndex}.${key}`)}
                                                                />
                                                            </td>
                                                        ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                            <LocalPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}

                    <div className="mt-3 d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleCancel} className="me-2">
                            Cancel
                        </Button>
                        <Button type="submit">Submit</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
