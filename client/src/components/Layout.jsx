import React from "react";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";


const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);
  return (
    <ProtectedRoute>
      <main style={{ height: '100vh', overflow: 'hidden' }}>
        <TopBar onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <section className="d-flex" style={{ height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
          <Sidebar
            show={sidebarCollapsed}
            onHide={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <div className="p-3 flex-grow-1 bg-light overflow-x-hidden" style={{ height: '100%', overflowY: 'auto' }}>
            <Outlet />
          </div>
        </section>
      </main>
      <ToastContainer />
    </ProtectedRoute>
  );
};

export default Layout;
