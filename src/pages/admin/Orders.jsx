import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Package, Search, Filter, ChevronDown, Eye, Clock, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getAllOrders();
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      preparing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      ready: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || colors.pending;
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = search === '' || 
      order.id?.toString().includes(search) ||
      order.customer_name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

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
          <h1 className="text-2xl font-serif font-bold text-foreground">Order Management</h1>
          <p className="text-muted-foreground">View and manage all customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All
          </button>
          {statuses.slice(0, 4).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Items</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Total</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={updating}
                          className={`appearance-none px-3 py-1 pr-8 rounded-full text-sm font-medium cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.id}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{selectedOrder.customer_name}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3">Order Items</h4>
              <div className="space-y-2 bg-muted/50 rounded-lg p-4">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                )) || <p className="text-muted-foreground">No items</p>}
                <div className="border-t border-border pt-2 mt-2 flex justify-between">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-foreground">
                    ${parseFloat(selectedOrder.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {selectedOrder.delivery_address && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Delivery Address</h4>
                <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {selectedOrder.delivery_address}
                </p>
              </div>
            )}

            {selectedOrder.special_instructions && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Special Instructions</h4>
                <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {selectedOrder.special_instructions}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-border">
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                disabled={updating}
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
