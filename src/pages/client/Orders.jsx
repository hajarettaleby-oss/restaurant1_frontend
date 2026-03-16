import { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import { Package, Clock, ChevronDown, ChevronUp, MapPin, Phone } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ClientOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'preparing':
        return <Package className="w-5 h-5 animate-pulse" />;
      case 'ready':
      case 'delivered':
        return <Package className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status);
    if (filter === 'completed') return order.status === 'delivered';
    if (filter === 'cancelled') return order.status === 'cancelled';
    return true;
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
          <h1 className="text-2xl font-serif font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your food orders</p>
        </div>

        <div className="flex gap-2">
          {['all', 'active', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No orders found</h3>
          <p className="text-muted-foreground">
            {filter === 'all' 
              ? "You haven't placed any orders yet." 
              : `No ${filter} orders to display.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
            >
              <div
                className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Order #{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-foreground">${parseFloat(order.total_amount).toFixed(2)}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="border-t border-border p-6 bg-muted/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Order Items</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-foreground">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        )) || (
                          <p className="text-sm text-muted-foreground">No items available</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3">Delivery Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <span className="text-muted-foreground">
                            {order.delivery_address || 'Pickup at restaurant'}
                          </span>
                        </div>
                        {order.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{order.phone}</span>
                          </div>
                        )}
                      </div>

                      {order.special_instructions && (
                        <div className="mt-4">
                          <h4 className="font-medium text-foreground mb-2">Special Instructions</h4>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                            {order.special_instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Progress */}
                  {['pending', 'confirmed', 'preparing', 'ready'].includes(order.status) && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <h4 className="font-medium text-foreground mb-4">Order Progress</h4>
                      <div className="flex items-center justify-between">
                        {['pending', 'confirmed', 'preparing', 'ready', 'delivered'].map((step, index) => {
                          const steps = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
                          const currentIndex = steps.indexOf(order.status);
                          const isActive = index <= currentIndex;
                          const isCurrent = index === currentIndex;

                          return (
                            <div key={step} className="flex items-center">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    isActive
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted text-muted-foreground'
                                  } ${isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                                >
                                  {index + 1}
                                </div>
                                <span className={`mt-2 text-xs ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {step.charAt(0).toUpperCase() + step.slice(1)}
                                </span>
                              </div>
                              {index < 4 && (
                                <div
                                  className={`w-12 sm:w-20 h-1 mx-2 ${
                                    index < currentIndex ? 'bg-primary' : 'bg-muted'
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
