import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Form, Button, Modal, Alert, Table } from 'react-bootstrap';
import useTemplates from '../../../lib/hooks/template';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export default function TemplateEditModal() {
    const { isEdit, template, setEdit, createTemplate, updateTemplate } = useTemplates();
    const { register, handleSubmit, reset, setValue, control, watch, formState: { errors, isSubmitSuccessful } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: '',
            address: '',
            value: '',
            items: []  
        }
    });
    const { fields, append, remove } = useFieldArray({
        name: "items", 
        control
    });

    const onSubmit = (data) => {
         console.log(data);
        if(!data.items || data.items.length === 0) {
            toast.error('At least one address,value config is required');
            return;
        }
        if (template) {
            // Update existing template
            updateTemplate(template.id, data);
        }
        else {
            // Create new template
            createTemplate(data);
        }
    };
    const handleAppend = () => {
        if (!watch('address') || !watch('value')) {
            toast.error('Address and Value are required');
            return;
        }  
        watch('address') && watch('value') && append({ address: watch('address'), value: watch('value') });
       //only reset address and value 
        setValue('address', '');
        setValue('value', '');
     };

     useEffect(() => {
        console.log('TemplateFormModal useEffect', template);
        
        if (template) {
            reset({
                name: template.name || '',
                items: template.items || [],
            });
            setValue('address', '');
            setValue('value', '');
        } else {
            reset({
                name: '',
                items: [],
            });
        }
     },[template])

     const handleClose = () => {
        setEdit(false);
        reset({
            name: '',
            items: [],
        });
     };

    return (
        <Modal size='lg' show={isEdit} onHide={handleClose} centered>
            <Modal.Header className='py-2' closeButton>
                <Modal.Title>
                    {template ? 'Edit Template' : 'Create Template'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='fs-6'>                
                <Form onSubmit={handleSubmit(onSubmit)} className='d-flex flex-wrap gap-1'>
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

                    <Table bordered className="mt-3 align-middle">
                        <thead>
                            <tr className="table-light text-uppercase">
                                <th>Address</th>
                                <th>Value</th>
                                <th className='text-center' width="50">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {fields.map((item, index) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.address || ''}
                                    </td>
                                    <td>
                                        {item.value || ''}
                                    </td>
                                    <td className='text-center'>
                                        <Button size='sm' variant="danger" onClick={() => remove(index)}><FaTrash /></Button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter address"
                                        defaultValue={watch('address') || ''}
                                        {...register('address', { required: 'Address is required' })}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.address?.message}
                                    </Form.Control.Feedback>
                                </td>
                                <td>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter value"
                                        defaultValue={watch('value') || ''}
                                        {...register('value', { required: 'Value is required' })}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.value?.message}
                                    </Form.Control.Feedback>
                                </td>
                                <td className='text-center'>
                                    <Button size='sm' variant="success" onClick={handleAppend}>
                                        <FaPlus />
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <div className="d-flex flex-fill w-100 justify-content-end">
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
    items: yup.array().of(
        yup.object().shape({
            address: yup.string().required('Address is required'),
            value: yup.string().required('Value is required'),
        })
    ),
});