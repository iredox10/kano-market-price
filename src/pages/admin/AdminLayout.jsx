
// src/pages/admin/AdminLayout.js
// Main layout for the admin dashboard.

import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar'; // Updated import path

const AdminLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <Outlet /> {/* Admin child routes will be rendered here */}
      </main>
    </div>
  );
};

export default AdminLayout;
