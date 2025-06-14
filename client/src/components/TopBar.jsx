import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useDispatch,useSelector } from 'react-redux';
import { logout } from '../lib/reducer/authSlice';

export default function TopBar({ onSidebarToggle }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  return (
    <Navbar className="bg-secondary-subtle" expand="lg">
      <Container className='m-0'>
        <Button
          variant="light"
          onClick={onSidebarToggle}
          aria-label="Open sidebar"
        >
          <span className="navbar-toggler-icon" />
        </Button>
        <Navbar.Brand className='px-2 me-auto text-uppercase text-success fw-medium'  href="/dashboard">Macsoft RMS</Navbar.Brand>
    <div className='ms-auto'>


        <Button size='sm' variant="outline-danger" onClick={() => dispatch(logout())}>
          Logout
        </Button>
        { user && (
          <span className='ms-2 text-muted text-uppercase'>
            {user.name || user.email}
          </span>
        )}
    </div>
      </Container>
    </Navbar>
  );
}