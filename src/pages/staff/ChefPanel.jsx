import { useState, useEffect } from 'react';
import { staffAPI } from '../../services/api';
import { ChefHat, Clock, CheckCircle, AlertCircle, Timer, Package } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ChefPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await staffAPI.getKitchenOrders();
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await staffAPI.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'border-amber-500 bg-amber-50 dark:bg-amber-900/20',
      confirmed: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
      preparing: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
      ready: 'border-green-500 bg-green-50 dark:bg-green-900/20'
    };
    return colors[status] || colors.pending;
  };

  const getTimeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status);
    return order.status === filter;
  });

  const orderCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ChefHat className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-foreground">Kitchen Panel</h1>
              <p className="text-sm text-muted-foreground">Manage incoming orders</p>
            </div>
          </div>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Status Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['pending', 'confirmed', 'preparing', 'ready', 'all'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                filter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && orderCounts[status] > 0 && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  filter === status ? 'bg-primary-foreground/20' : 'bg-primary text-primary-foreground'
                }`}>
                  {orderCounts[status]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No orders</h3>
            <p className="text-muted-foreground">
              {filter === 'all' ? 'No active orders at the moment' : `No ${filter} orders`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`border-l-4 rounded-xl shadow-sm overflow-hidden ${getStatusColor(order.status)}`}
              >
                <div className="bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-foreground">Order #{order.id}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Timer className="w-4 h-4" />
                      {getTimeSince(order.created_at)}
                    </div>
                  </div>

                  {order.order_type && (
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mb-3 ${
                      order.order_type === 'dine-in' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {order.order_type === 'dine-in' ? `Table ${order.table_number || '-'}` : 'Takeaway'}
                    </span>
                  )}

                  <div className="space-y-2 mb-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-foreground">
                            {item.quantity}x {item.name}
                          </span>
                          {item.special_instructions && (
                            <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3 h-3" />
                              {item.special_instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    )) || <p className="text-muted-foreground">No items</p>}
                  </div>

                  {order.special_instructions && (
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg mb-4">
                      <p className="text-sm text-amber-800 dark:text-amber-400 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {order.special_instructions}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                        disabled={updating === order.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        disabled={updating === order.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                      >
                        <Clock className="w-4 h-4" />
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        disabled={updating === order.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                        Ready for Pickup
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
