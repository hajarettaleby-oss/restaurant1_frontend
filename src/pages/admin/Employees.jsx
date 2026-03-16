import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, FiPlus, FiEdit2, FiTrash2, FiSearch, 
  FiPhone, FiMail, FiCalendar, FiDollarSign,
  FiChevronDown, FiX, FiCheck, FiAlertCircle
} from 'react-icons/fi';
import api from '../../services/api';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'waiter',
    salary: '',
    hire_date: new Date().toISOString().split('T')[0]
  });

  const roles = [
    { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    { value: 'chef', label: 'Chef', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
    { value: 'waiter', label: 'Waiter', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    { value: 'cashier', label: 'Cashier', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' }
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      // Mock data for demonstration
      setEmployees([
        { id: 1, first_name: 'Ahmed', last_name: 'Hassan', email: 'ahmed@ettaleby.com', phone: '+212 6 12 34 56 78', role: 'chef', salary: 8000, hire_date: '2023-01-15', status: 'active' },
        { id: 2, first_name: 'Fatima', last_name: 'Zahra', email: 'fatima@ettaleby.com', phone: '+212 6 23 45 67 89', role: 'waiter', salary: 4500, hire_date: '2023-03-20', status: 'active' },
        { id: 3, first_name: 'Youssef', last_name: 'Alami', email: 'youssef@ettaleby.com', phone: '+212 6 34 56 78 90', role: 'cashier', salary: 5000, hire_date: '2023-02-10', status: 'active' },
        { id: 4, first_name: 'Khadija', last_name: 'Benali', email: 'khadija@ettaleby.com', phone: '+212 6 45 67 89 01', role: 'waiter', salary: 4500, hire_date: '2023-04-05', status: 'active' },
        { id: 5, first_name: 'Omar', last_name: 'Tazi', email: 'omar@ettaleby.com', phone: '+212 6 56 78 90 12', role: 'admin', salary: 12000, hire_date: '2022-06-01', status: 'active' },
        { id: 6, first_name: 'Salma', last_name: 'Idrissi', email: 'salma@ettaleby.com', phone: '+212 6 67 89 01 23', role: 'chef', salary: 7500, hire_date: '2023-05-15', status: 'active' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, formData);
        setEmployees(employees.map(emp => 
          emp.id === editingEmployee.id ? { ...emp, ...formData } : emp
        ));
      } else {
        const response = await api.post('/employees', formData);
        setEmployees([...employees, { id: Date.now(), ...formData, status: 'active' }]);
      }
      closeModal();
    } catch (error) {
      // For demo, update locally
      if (editingEmployee) {
        setEmployees(employees.map(emp => 
          emp.id === editingEmployee.id ? { ...emp, ...formData } : emp
        ));
      } else {
        setEmployees([...employees, { id: Date.now(), ...formData, status: 'active' }]);
      }
      closeModal();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (error) {
        setEmployees(employees.filter(emp => emp.id !== id));
      }
    }
  };

  const openModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone,
        role: employee.role,
        salary: employee.salary,
        hire_date: employee.hire_date
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'waiter',
        salary: '',
        hire_date: new Date().toISOString().split('T')[0]
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  const getRoleColor = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.color : 'bg-gray-100 text-gray-800';
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: employees.length,
    chefs: employees.filter(e => e.role === 'chef').length,
    waiters: employees.filter(e => e.role === 'waiter').length,
    cashiers: employees.filter(e => e.role === 'cashier').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground">Manage your restaurant staff</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FiUsers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Staff</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FiUsers className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.chefs}</p>
              <p className="text-sm text-muted-foreground">Chefs</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.waiters}</p>
              <p className="text-sm text-muted-foreground">Waiters</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <FiUsers className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.cashiers}</p>
              <p className="text-sm text-muted-foreground">Cashiers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Roles</option>
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Salary</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Hire Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.map((employee) => (
                <motion.tr
                  key={employee.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {employee.first_name[0]}{employee.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{employee.first_name} {employee.last_name}</p>
                        <p className="text-sm text-muted-foreground">ID: #{employee.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FiMail className="w-4 h-4" />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FiPhone className="w-4 h-4" />
                        {employee.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
                      {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-foreground">
                      <FiDollarSign className="w-4 h-4 text-muted-foreground" />
                      {employee.salary?.toLocaleString()} MAD
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FiCalendar className="w-4 h-4" />
                      {new Date(employee.hire_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(employee)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <FiUsers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No employees found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Salary (MAD)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Hire Date</label>
                  <input
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {editingEmployee ? 'Update' : 'Add'} Employee
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Employees;
