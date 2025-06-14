import { Button, Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaUser, FaCog } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

export default function Sidebar({ show, onHide }) {

  return (
    <aside className={`sidebar${show ? ' collapsed' : ''} position-relative`}>
      {!show && (
      <Button
        size='sm'

        variant="outline-secondary"
        className="position-absolute d-lg-none top-0 end-0 m-2"
        onClick={onHide}
        aria-label="Toggle sidebar"
      >
        X
      </Button>
      )}
      <Nav className="nav">
        <Nav.Link as={NavLink} to="/devices" className='nav-link'>
          <FaTachometerAlt />
          <span style={{ marginLeft: 8 }}>Devices</span>
        </Nav.Link>
       {/*  <Nav.Link as={NavLink} to="/profile" className='nav-link'>
          <FaUser />
          <span style={{ marginLeft: 8 }}>Profile</span>
        </Nav.Link>
        <Nav.Link as={NavLink} to="/settings" className='nav-link'>
          <FaCog />
          <span style={{ marginLeft: 8 }}>Settings</span>
        </Nav.Link> */}
      </Nav>
    </aside>
  );
}

