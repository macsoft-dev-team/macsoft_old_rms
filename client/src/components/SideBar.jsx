import { Button, Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaUser, FaCog } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import { logout } from '../lib/reducer/authSlice';
import { useDispatch } from 'react-redux';
export default function Sidebar({ show, onHide }) {
  const dispatch = useDispatch();
  return (
    <div className=' position-relative d-flex h-100' >
    <aside className={`sidebar ${show ? ' collapsed' : ''}`}>
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
        <Nav.Link as={NavLink} to="/device-log" className='nav-link'>
          <FaUser />
          <span style={{ marginLeft: 8 }}>Device Log</span>
        </Nav.Link>
        {/*
        <Nav.Link as={NavLink} to="/settings" className='nav-link'>
          <FaCog />
          <span style={{ marginLeft: 8 }}>Settings</span>
        </Nav.Link> */}
       </Nav>
        <Button className='m-2 mt-auto d-flex align-items-center justify-content-center gap-2' size='sm' variant="outline-danger" onClick={() => dispatch(logout())}>
          <MdLogout/>
          <span className={`${show ? 'd-block d-lg-none' : ''}`}>Logout</span>
        </Button>
    </aside>
      
    </div>
  );
}

