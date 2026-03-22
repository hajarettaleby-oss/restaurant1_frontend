import axios from 'axios'

// ETTALEBY PLATES Restaurant API Service - Updated
const API = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

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

export const authAPI = {
  login: (credentials) => API.post('/login', credentials),
  register: (userData) => API.post('/register', userData),
  logout: () => API.post('/logout'),
  getProfile: () => API.get('/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/password', data),
}

export const menuAPI = {
  getItems: (params) => API.get('/menu/items', { params }),
  getItem: (id) => API.get(`/menu/item/${id}`),
  getCategories: () => API.get('/menu/categories'),
  createItem: (data) => API.post('/menu-items', data),
  updateItem: (id, data) => API.put(`/menu-items/${id}`, data),
  deleteItem: (id) => API.delete(`/menu-items/${id}`),
}

export const cartAPI = {
  getCart: () => API.get('/cart'),
  addToCart: (data) => API.post('/cart/add', data),
  updateCartItem: (id, data) => API.put(`/cart/update/${id}`, data),
  removeFromCart: (id) => API.delete(`/cart/remove/${id}`),
  clearCart: () => API.delete('/cart/clear'),
}
// ================= ORDERS =================
export const orderAPI = {
  // ✅ CREATE ORDER
  createOrder: (data) => API.post('/orders/create', data),

  // ✅ GET MY ORDERS
  getMyOrders: () => API.get('/orders/my'),

  // ✅ GET SINGLE ORDER
  getOrder: (id) => API.get(`/orders/${id}`),
}


// (اختياري) إلا محتاج ordersAPI
export const ordersAPI = {
  createOrder: (data) => API.post('/orders/create', data),
  getMyOrders: () => API.get('/orders/my'),
  getOrder: (id) => API.get(`/orders/${id}`),
}

export const reservationAPI = {
  create: (data) => API.post('/reservations/create', data),
  getAll: (params) => API.get('/reservations', { params }),
  get: (id) => API.get(`/reservations/${id}`),
  update: (id, data) => API.put(`/reservations/${id}`, data),
  cancel: (id) => API.put(`/reservations/${id}/cancel`),
  getMyReservations: () => API.get('/reservations/my'),
}

export const reservationsAPI = {
  create: (data) => API.post('/reservations/create', data),
  getAll: (params) => API.get('/reservations', { params }),
  get: (id) => API.get(`/reservations/${id}`),
  update: (id, data) => API.put(`/reservations/${id}`, data),
  cancel: (id) => API.put(`/reservations/${id}/cancel`),
  getMyReservations: () => API.get('/reservations/my'),
}

export const reviewAPI = {
  getAll: (params) => API.get('/reviews', { params }),
  create: (data) => API.post('/reviews', data),
  update: (id, data) => API.put(`/reviews/${id}`, data),
  delete: (id) => API.delete(`/reviews/${id}`),
}

export const employeeAPI = {
  getAll: (params) => API.get('/employees', { params }),
  get: (id) => API.get(`/employees/${id}`),
  create: (data) => API.post('/employees', data),
  update: (id, data) => API.put(`/employees/${id}`, data),
  delete: (id) => API.delete(`/employees/${id}`),
}

export const tableAPI = {
  getAll: () => API.get('/tables'),
  get: (id) => API.get(`/tables/${id}`),
  create: (data) => API.post('/tables', data),
  update: (id, data) => API.put(`/tables/${id}`, data),
  delete: (id) => API.delete(`/tables/${id}`),
  getZones: () => API.get('/zones'),
}

export const inventoryAPI = {
  getIngredients: (params) => API.get('/ingredients', { params }),
  getLowStock: () => API.get('/ingredients/low-stock'),
}

export const analyticsAPI = {
  getDashboard: () => API.get('/analytics/dashboard'),
  getOrderStats: (params) => API.get('/analytics/orders', { params }),
  getRevenueStats: (params) => API.get('/analytics/revenue', { params }),
}

export const vipAPI = {
  getVIPClients: () => API.get('/vip-clients'),
  toggleVIP: (userId) => API.put(`/users/${userId}/toggle-vip`),
}

export const paymentAPI = {
  getQueue: () => API.get('/payments/queue'),
  confirmPayment: (orderId, data) => API.post(`/payments/${orderId}/confirm`, data),
  generateReceipt: (orderId) => API.get(`/payments/${orderId}/receipt`),
  getDailyReport: () => API.get('/payments/daily-report'),
}

export const favoriteAPI = {
  getAll: () => API.get('/favorites'),
  add: (menuItemId) => API.post('/favorites', { menu_item_id: menuItemId }),
  remove: (menuItemId) => API.delete(`/favorites/${menuItemId}`),
}

export const usersAPI = {
  getAll: (params) => API.get('/users', { params }),
  get: (id) => API.get(`/users/${id}`),
  create: (data) => API.post('/users', data),
  update: (id, data) => API.put(`/users/${id}`, data),
  delete: (id) => API.delete(`/users/${id}`),
  toggleVIP: (id) => API.put(`/users/${id}/toggle-vip`),
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
}

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getStats: () => API.get('/admin/stats'),
  getOrders: (params) => API.get('/admin/orders', { params }),
  getAllOrders: (params) => API.get('/orders', { params }),
  getRecentOrders: () => API.get('/orders?limit=5&sort=-created_at'),
  getReservations: (params) => API.get('/admin/reservations', { params }),
  getAllReservations: (params) => API.get('/reservations', { params }),
  getUsers: (params) => API.get('/admin/users', { params }),
  getEmployees: (params) => API.get('/admin/employees', { params }),
  getMenuItems: (params) => API.get('/admin/menu-items', { params }),
  updateOrderStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
  updateReservationStatus: (id, status) => API.put(`/reservations/${id}/status`, { status }),
}

export default API
