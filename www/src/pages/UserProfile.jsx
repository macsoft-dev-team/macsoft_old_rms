import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../store/userSlice';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';

export default function UserProfile() {
  const user = useSelector(state => state.user.info);
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState({ old: '', new: '' });

  const handleSave = () => {
    dispatch(updateProfile(form));
    setEdit(false);
  };

  const handlePwdChange = e => {
    e.preventDefault();
    setShowPwd(false);
    setPwd({ old: '', new: '' });
    // No real password change, just UI
  };

  return (
    <div>
      <h3 className="mb-4">User Profile</h3>
      <Card>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    value={form.name}
                    disabled={!edit}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    value={form.email}
                    disabled={!edit}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control value={user.role} disabled />
            </Form.Group>
            {!edit && (
              <Button variant="secondary" onClick={() => setEdit(true)}>Edit</Button>
            )}
            {edit && (
              <>
                <Button variant="primary" onClick={handleSave}>Save</Button>{' '}
                <Button variant="secondary" onClick={() => setEdit(false)}>Cancel</Button>
              </>
            )}
            <Button className="ms-3" variant="outline-primary" onClick={() => setShowPwd(s => !s)}>
              {showPwd ? 'Hide' : 'Change Password'}
            </Button>
          </Form>
          {showPwd && (
            <Form className="mt-4" onSubmit={handlePwdChange}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={pwd.old}
                      onChange={e => setPwd(p => ({ ...p, old: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={pwd.new}
                      onChange={e => setPwd(p => ({ ...p, new: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit" variant="primary">Change Password</Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
