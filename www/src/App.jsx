import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import AppRoutes from './routes';
import { useLocation } from 'react-router-dom';

export default function App() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  if (isLogin) {
    return (
      <div>
        <AppRoutes />
      </div>
    );
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={2} className="p-0 bg-light vh-100">
          <Sidebar />
        </Col>
        <Col xs={10} className="p-0">
          <TopNav />
          <div className="p-4">
            <AppRoutes />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
