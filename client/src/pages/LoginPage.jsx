import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Form, Button, Spinner, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { login } from '../lib/reducer/authSlice';
import { toast } from 'react-toastify';
const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const onSubmit = async (data) => {
    dispatch(login(data))
      .unwrap()
      .then(() => {
        // Redirect to dashboard or home page after successful login
        window.location.href = '/devices';
      })
      .catch((error) => {
        // Handle login error, e.g., show an alert
        console.error('Login failed:', error);
        toast.error('Login failed: ' + (error.message || 'Please try again.'));
      });
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h2 className="mb-4 text-center">Login</h2>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Email"
                    {...register('email', { required: 'Email is required' })}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    {...register('password', { required: 'Password is required' })}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100" /* disabled={isLoading} */>
                  {loading || isAuthenticated ? <><Spinner animation="border" size="sm" /> Logging in...</> : 'Login'}
                 </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
