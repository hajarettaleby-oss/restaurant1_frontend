import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Users as UsersIcon, Search, Edit2, Trash2, UserPlus, Shield } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'client',
    password: ''
  });

  const roles = ['client', 'admin', 'chef', 'waiter', 'cashier'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data?.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user = null) => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'client',
        password: ''
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'client',
        password: ''
      });
    }
    setEditModal({ open: true, user });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editModal.user) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        
        await adminAPI.updateUser(editModal.user.id, updateData);
        setUsers(prev =>
          prev.map(user =>
            user.id === editModal.user.id ? { ...user, ...updateData } : user
          )
        );
      } else {
        const response = await adminAPI.createUser(formData);
        setUsers(prev => [...prev, response.data.user]);
      }
      setEditModal({ open: false, user: null });
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    setSaving(true);

    try {
      await adminAPI.deleteUser(deleteModal.user.id);
      setUsers(prev => prev.filter(user => user.id !== deleteModal.user.id));
      setDeleteModal({ open: false, user: null });
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setSaving(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      chef: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      waiter: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      cashier: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      client: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return colors[role] || colors.client;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles</p>
        </div>
        <button
          onClick={() => openEditModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">All Roles</option>
          {roles.map(role => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.first_name} {user.last_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4 text-muted-foreground">{user.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, user })}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <UsersIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, user: null })}
        title={editModal.user ? 'Edit User' : 'Add User'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {editModal.user ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              required={!editModal.user}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setEditModal({ open: false, user: null })}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : editModal.user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        title="Delete User"
      >
        <div className="p-6">
          <p className="text-muted-foreground mb-6">
            Are you sure you want to delete <strong className="text-foreground">{deleteModal.user?.first_name} {deleteModal.user?.last_name}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteModal({ open: false, user: null })}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {saving ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
