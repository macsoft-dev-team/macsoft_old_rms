import { Button, Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaUser, FaCog } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { MdLogout } from "react-icons/md";
import { logout } from '../lib/reducer/authSlice';
import { useDispatch } from 'react-redux';
import {navData} from '../lib/constants/navData';
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
        {navData.map(item => (
          <LinkNav key={item.title} {...item} />
        ))}
       </Nav>
        <Button className='m-2 mt-auto d-flex align-items-center justify-content-center gap-2' size='sm' variant="outline-danger" onClick={() => dispatch(logout())}>
          <MdLogout/>
          <span className={`${show ? 'd-block d-lg-none' : ''}`}>Logout</span>
        </Button>
    </aside>
      
    </div>
  );
}

const LinkNav=(props)=>{
  const{title,icon,url} =props;
  return (
    <Nav.Link as={NavLink} to={url} className='nav-link'>
      {icon}
      <span style={{ marginLeft: 8 }}>{title}</span>
    </Nav.Link>
  );
}

