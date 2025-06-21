import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, Button, Form } from 'react-bootstrap';

const schema = yup.object().shape({
  address: yup.string().required('Address required'),
  value: yup.string().required('Value required'),
});

export default function SendCommand() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [response, setResponse] = useState('');

  const onSubmit = data => {
    setResponse(`Command sent to ${data.address} with value "${data.value}" (mock response)`);
  };

  return (
    <div>
      <h3 className="mb-4">Send Command</h3>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control {...register('address')} />
              {errors.address && <div className="text-danger">{errors.address.message}</div>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Value</Form.Label>
              <Form.Control {...register('value')} />
              {errors.value && <div className="text-danger">{errors.value.message}</div>}
            </Form.Group>
            <Button type="submit" variant="primary">Send</Button>
          </Form>
          {response && <div className="mt-3"><b>Response:</b> {response}</div>}
        </Card.Body>
      </Card>
    </div>
  );
}
