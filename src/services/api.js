import axios from 'axios'

// ETTALEBY PLATES Restaurant API Service
// Updated to match Laravel backend routes at /api/v1/
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - adds auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handles 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API - matches Laravel AuthController
export const authAPI = {
  login: (credentials) => API.post('/login', credentials),
  register: (userData) => API.post('/register', userData),
  logout: () => API.post('/logout'),
  getProfile: () => API.get('/profile'),
}

// Menu API - matches Laravel MenuController
export const menuAPI = {
  getCategories: () => API.get('/menu/categories'),
  getItems: (categoryId) => API.get(`/menu/items/${categoryId}`),
  getItem: (itemId) => API.get(`/menu/item/${itemId}`),
  search: (query) => API.get(`/menu/search/${query}`),
}

// Cart API - matches Laravel CartController
export const cartAPI = {
  getCart: () => API.get('/cart'),
  addToCart: (data) => API.post('/cart/add', data),
  updateCartItem: (itemId, data) => API.put(`/cart/update/${itemId}`, data),
  removeFromCart: (itemId) => API.delete(`/cart/remove/${itemId}`),
  clearCart: () => API.delete('/cart/clear'),
}

// Order API - matches Laravel OrderController
export const orderAPI = {
  createOrder: (data) => API.post('/orders/create', data),
  getMyOrders: () => API.get('/orders/my'),
  getOrder: (orderId) => API.get(`/orders/${orderId}`),
  markPreparing: (orderId) => API.put(`/orders/${orderId}/preparing`),
  markReady: (orderId) => API.put(`/orders/${orderId}/ready`),
  markServed: (orderId) => API.put(`/orders/${orderId}/served`),
}

// Alias for orderAPI
export const ordersAPI = orderAPI

// Reservation API - matches Laravel ReservationController
export const reservationAPI = {
  create: (data) => API.post('/reservations/create', data),
  getMyReservations: () => API.get('/reservations/my'),
  cancel: (reservationId) => API.put(`/reservations/${reservationId}/cancel`),
}

// Alias for reservationAPI
export const reservationsAPI = reservationAPI

// Comments/Reviews API - matches Laravel CommentController
export const reviewAPI = {
  create: (data) => API.post('/comments/create', data),
  getAll: () => API.get('/comments'),
}

// Chef API - matches Laravel ChefController
export const chefAPI = {
  getAssignedOrders: () => API.get('/chef/orders'),
  getRecipe: (menuItemId) => API.get(`/chef/recipe/${menuItemId}`),
  getLowStock: () => API.get('/chef/low-stock'),
  getWorkload: () => API.get('/chef/workload'),
  getSchedule: () => API.get('/chef/schedule'),
}

// Waiter API - matches Laravel WaiterController
export const waiterAPI = {
  getReadyOrders: () => API.get('/waiter/ready-orders'),
  getAssignedTables: () => API.get('/waiter/assigned-tables'),
  getTableInfo: (tableId) => API.get(`/waiter/table/${tableId}`),
  updateTableStatus: (tableId, status) => API.put(`/waiter/table/${tableId}/status/${status}`),
  transferTable: (tableId, newWaiterId) => API.put(`/waiter/table/${tableId}/transfer/${newWaiterId}`),
  getSchedule: () => API.get('/waiter/schedule'),
}

// Cashier API - matches Laravel CashierController
export const cashierAPI = {
  getPaymentQueue: () => API.get('/cashier/payment-queue'),
  processPayment: (orderId, method) => API.post(`/cashier/payment/${orderId}/${method}`),
  refund: (paymentId) => API.put(`/cashier/refund/${paymentId}`),
  getDailyRevenue: () => API.get('/cashier/daily-revenue'),
  closeShift: () => API.post('/cashier/close-shift'),
}

// Admin API - matches Laravel AdminController
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getRevenueAnalytics: () => API.get('/admin/revenue-analytics'),
  getOrdersByStatus: () => API.get('/admin/orders-by-status'),
  
  // Employee management
  getEmployees: () => API.get('/admin/employees'),
  createEmployee: (data) => API.post('/admin/employees/create', data),
  updateShift: (employeeId, data) => API.put(`/admin/employees/${employeeId}/shift`, data),
  
  // Supplier management
  getSuppliers: () => API.get('/admin/suppliers'),
  createSupplier: (data) => API.post('/admin/suppliers/create', data),
  
  // Ingredients management
  getIngredients: () => API.get('/admin/ingredients'),
  updateIngredient: (ingredientId, data) => API.put(`/admin/ingredients/${ingredientId}`, data),
  
  // Recipe management
  getRecipes: () => API.get('/admin/recipes'),
  
  // Reservation management
  getPendingReservations: () => API.get('/admin/reservations/pending'),
  approveReservation: (reservationId) => API.put(`/admin/reservations/${reservationId}/approve`),
  rejectReservation: (reservationId) => API.put(`/admin/reservations/${reservationId}/reject`),
  
  // Reviews management
  getPendingReviews: () => API.get('/admin/reviews/pending'),
  approveReview: (commentId) => API.put(`/admin/reviews/${commentId}/approve`),
  rejectReview: (commentId) => API.put(`/admin/reviews/${commentId}/reject`),
  
  // Client management
  blockClient: (clientId) => API.put(`/admin/clients/${clientId}/block`),
  unblockClient: (clientId) => API.put(`/admin/clients/${clientId}/unblock`),
  promoteVip: (clientId) => API.put(`/admin/clients/${clientId}/promote-vip`),
  
  // Reports
  getAttendance: () => API.get('/admin/attendance'),
  getActivityLogs: () => API.get('/admin/activity-logs'),
}

// Legacy aliases (for backwards compatibility)
export const employeeAPI = adminAPI
export const tableAPI = waiterAPI
export const inventoryAPI = {
  getIngredients: adminAPI.getIngredients,
  getLowStock: chefAPI.getLowStock,
}
export const analyticsAPI = {
  getDashboard: adminAPI.getDashboard,
  getRevenueStats: adminAPI.getRevenueAnalytics,
}
export const vipAPI = {
  promoteVip: adminAPI.promoteVip,
}
export const paymentAPI = cashierAPI
export const favoriteAPI = {
  getAll: () => Promise.resolve({ data: [] }),
  add: () => Promise.resolve({ data: {} }),
  remove: () => Promise.resolve({ data: {} }),
}
export const usersAPI = adminAPI

export default API
