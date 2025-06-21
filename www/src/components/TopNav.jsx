import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';

export default function TopNav() {
  const dispatch = useDispatch();
  return (
    <Navbar bg="white" expand="lg" className="border-bottom">
      <Container fluid>
        <Navbar.Brand>RMS</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link onClick={() => dispatch(logout())}>Logout</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
