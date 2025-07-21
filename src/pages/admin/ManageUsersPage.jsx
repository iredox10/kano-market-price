
// src/pages/admin/ManageUsersPage.js
// Page for admins to manage all registered users.

import React, { useState, useMemo } from 'react';
import { allUsers } from '../../data/mockData';
import { FiSearch, FiUserX, FiActivity, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ITEMS_PER_PAGE = 8;

const StatusBadge = ({ status }) => {
  const colorClasses = {
    'Active': 'bg-green-100 text-green-800',
    'Suspended': 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const ManageUsersPage = () => {
  const [users, setUsers] = useState(allUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, users]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSuspend = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' } : user
    ));
    console.log(`Toggled suspension for user ID: ${userId}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="px-5 py-3 font-semibold">User Name</th>
              <th className="px-5 py-3 font-semibold">Email</th>
              <th className="px-5 py-3 font-semibold">Sign-up Date</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-5 py-4">
                  <p className="text-gray-900 font-semibold whitespace-no-wrap">{user.name}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-700 whitespace-no-wrap">{user.email}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-gray-700 whitespace-no-wrap">{user.signupDate}</p>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => handleSuspend(user.id)}
                      className={`p-2 rounded-full ${user.status === 'Active' ? 'text-yellow-600 hover:text-yellow-800 bg-yellow-100' : 'text-green-600 hover:text-green-800 bg-green-100'}`}
                      title={user.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
                    >
                      <FiUserX size={18} />
                    </button>
                    <button className="text-blue-500 hover:text-blue-700 p-2 bg-blue-100 rounded-full" title="View Activity">
                      <FiActivity size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 bg-white border rounded-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiChevronLeft className="mr-2" /> Previous
        </button>
        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 bg-white border rounded-lg font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next <FiChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ManageUsersPage;
