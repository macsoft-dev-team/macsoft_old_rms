import React from "react";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
 

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  return (
    <ProtectedRoute>
      <main>
        <TopBar onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <section className="d-flex">
          <Sidebar
            show={sidebarCollapsed}
            onHide={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <div className="p-3 flex-grow-1 bg-light overflow-x-hidden">

          <Outlet />
          </div>
         </section>
      </main>
    </ProtectedRoute>
  );
};

export default Layout;
