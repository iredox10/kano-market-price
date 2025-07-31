
// src/pages/admin/ManageUsersPage.js
// Page for admins to manage all registered users, powered by Appwrite.

import React, { useState, useEffect, useMemo } from 'react';
import { databases, users as appwriteUsers } from '../../appwrite/config';
import { DATABASE_ID, USERS_COLLECTION_ID } from '../../appwrite/constants';
import { Query } from 'appwrite';
import { FiSearch, FiUserX, FiUserCheck, FiChevronLeft, FiChevronRight, FiActivity } from 'react-icons/fi';
import InfoModal from '../../components/InfoModal';
import UserActivityModal from '../../components/admin/UserActivityModal'; // Import the new modal

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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ type: null, data: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID);
      setUsers(response.documents);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setModal({ type: 'info', data: { title: 'Error', message: 'Failed to load user data.', type: 'error' } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    const isNowBlocked = newStatus === 'Suspended';

    try {
      await appwriteUsers.updateStatus(user.$id, !isNowBlocked);
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id,
        { status: newStatus }
      );

      setModal({ type: 'info', data: { title: 'Success', message: `User "${user.name}" has been ${newStatus.toLowerCase()}.`, type: 'success' } });
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error(`Failed to update user status for ${user.name}:`, error);
      setModal({ type: 'info', data: { title: 'Error', message: 'Failed to update user status.', type: 'error' } });
    }
  };

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

  return (
    <>
      <InfoModal isOpen={modal.type === 'info'} onClose={() => setModal({ type: null })} {...modal.data} />
      <UserActivityModal isOpen={modal.type === 'activity'} onClose={() => setModal({ type: null })} user={modal.data} />
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>

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
          {loading ? (
            <p className="p-12 text-center text-gray-500">Loading users...</p>
          ) : (
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
                  <tr key={user.$id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="text-gray-900 font-semibold whitespace-no-wrap">{user.name}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-700 whitespace-no-wrap">{user.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-gray-700 whitespace-no-wrap">{new Date(user.$createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`p-2 rounded-full ${user.status === 'Active' ? 'text-yellow-600 hover:text-yellow-800 bg-yellow-100' : 'text-green-600 hover:text-green-800 bg-green-100'}`}
                          title={user.status === 'Active' ? 'Suspend User' : 'Reactivate User'}
                        >
                          {user.status === 'Active' ? <FiUserX size={18} /> : <FiUserCheck size={18} />}
                        </button>
                        <button
                          onClick={() => setModal({ type: 'activity', data: user })}
                          className="p-2 rounded-full text-blue-600 hover:text-blue-800 bg-blue-100"
                          title="View User Activity"
                        >
                          <FiActivity size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
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
        )}
      </div>
    </>
  );
};

export default ManageUsersPage;
