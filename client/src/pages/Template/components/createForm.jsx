import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Modal, Table, Row, Col } from 'react-bootstrap';
import useTemplates from '../../../lib/hooks/template';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AddressValueAceEditor from './AddressValueAceEditor';

export default function TemplateCreateModal() {
    const { isCreate, template, setCreate, createTemplate, updateTemplate } = useTemplates();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            aceInput: '',
            items: []
        }
    });
    const [aceInput, setAceInput] = useState('');
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (template) {
            reset({
                name: template.name || '',
                aceInput: '',
                items: template.items || [],
            });
            setItems(template.items || []);
            setAceInput('');
        } else {
            reset({ name: '', aceInput: '', items: [] });
            setItems([]);
            setAceInput('');
        }
    }, [template, reset]);

    const parseAceInput = (input) => {
        return input
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line)
            .map(line => {
                const [address, value] = line.split(',').map(s => s.trim());
                return address && value ? { address, value } : null;
            })
            .filter(Boolean);
    };

    const onSubmit = (data) => {
        const parsedItems = parseAceInput(aceInput);
        if (!parsedItems.length) {
            toast.error('Please enter at least one address,value pair in the editor.');
            return;
        }
        const submitData = {
            name: data.name,
            items: parsedItems
        };
        createTemplate(submitData);
    };

    const handleClose = () => {
        setCreate(false);
        reset({ name: '', aceInput: '', items: [] });
        setAceInput('');
        setItems([]);
    };

    return (
        <Modal size='xl' show={isCreate} onHide={handleClose} centered>
            <Modal.Header className='py-2' closeButton>
                <Modal.Title>
                    {template ? 'Edit Template' : 'Create Template'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='fs-6'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter template name"
                            {...register('name', { required: 'Name is required' })}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Row>
                        <Col xs={12} md={6}>
                            <Form.Group controlId="aceInput" className="mt-3">
                                <Form.Label>Paste Address,Value pairs (e.g. 000A,1234)</Form.Label>
                                <AddressValueAceEditor value={aceInput} onChange={setAceInput} />
                            </Form.Group>
                        </Col>
                        <Col xs={12} md={6}>
                            {aceInput && parseAceInput(aceInput).length > 0 && (
                                <Table bordered className="mt-3 align-middle">
                                    <thead>
                                        <tr className="table-light text-uppercase">
                                            <th>Address</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parseAceInput(aceInput).map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.address}</td>
                                                <td>{item.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Col>
                    </Row>
                    <div className="d-flex flex-fill w-100 justify-content-end mt-3">
                        <Button variant="secondary" className="me-2" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
});