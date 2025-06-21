import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/devices', label: 'Devices' },
  { to: '/historical', label: 'Historical Data' },
  { to: '/templates', label: 'Config Templates' },
  { to: '/send-command', label: 'Send Command' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/profile', label: 'User Profile' },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <Nav className="flex-column vh-100 p-3">
      {navItems.map(item => (
        <Nav.Link
          as={Link}
          to={item.to}
          key={item.to}
          active={location.pathname === item.to}
        >
          {item.label}
        </Nav.Link>
      ))}
    </Nav>
  );
}
