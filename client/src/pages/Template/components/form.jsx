import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

export default function TemplateForm() {
    const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm();

    const onSubmit = (data) => {
        // Handle form submission (e.g., send data to API)
        console.log(data);
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2 className="mb-4">Create Template</h2>
                    {isSubmitSuccessful && <Alert variant="success">Template created successfully!</Alert>}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3" controlId="name">
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
                      
                        <Button variant="primary" type="submit">
                            Submit 
                        </Button>
                         <Button variant="secondary" className="ms-2" onClick={() => console.log('Cancel')}>
                            Cancel
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}