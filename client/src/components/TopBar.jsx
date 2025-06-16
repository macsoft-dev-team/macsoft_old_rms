import React from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useDispatch,useSelector } from 'react-redux';
import { logout } from '../lib/reducer/authSlice';
import { FaUser } from 'react-icons/fa';

export default function TopBar({ onSidebarToggle }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  return (
    <Navbar className="bg-secondary-subtle" expand="lg">
      <Container className='m-0'>
        <Button
        size='sm'
          className='border-0'
          variant="none"
          onClick={onSidebarToggle}
          aria-label="Open sidebar"
        >
          <span className="navbar-toggler-icon" />
        </Button>
        <Navbar.Brand className='px-2 me-auto text-uppercase text-success fw-medium fs-6'  href="/devices">Macsoft RMS</Navbar.Brand>
      </Container>
    </Navbar>
  );
}