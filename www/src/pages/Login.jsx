import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { login } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().min(4, 'Min 4 chars').required('Password required'),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = data => {
    dispatch(login({ name: 'Admin User', email: data.email, role: 'Administrator' }));
    navigate('/');
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={5} lg={4}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-4 text-center">Login</Card.Title>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control {...register('email')} type="email" placeholder="Enter email" />
                  {errors.email && <Alert variant="danger" className="mt-2 py-1">{errors.email.message}</Alert>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control {...register('password')} type="password" placeholder="Password" />
                  {errors.password && <Alert variant="danger" className="mt-2 py-1">{errors.password.message}</Alert>}
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">Login</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
