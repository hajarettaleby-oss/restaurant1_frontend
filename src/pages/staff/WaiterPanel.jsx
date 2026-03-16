import { useState, useEffect } from 'react';
import { staffAPI } from '../../services/api';
import { Users, Clock, Bell, CheckCircle, MapPin, Package, Utensils } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function WaiterPanel() {
  const [tables, setTables] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tables');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [tablesRes, ordersRes] = await Promise.all([
        staffAPI.getTables(),
        staffAPI.getReadyOrders()
      ]);
      setTables(tablesRes.data?.tables || []);
      setReadyOrders(ordersRes.data?.orders || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliverOrder = async (orderId) => {
    setUpdating(orderId);
    try {
      await staffAPI.updateOrderStatus(orderId, 'delivered');
      setReadyOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Failed to update order:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getTableStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 border-green-500 dark:bg-green-900/30',
      occupied: 'bg-red-100 border-red-500 dark:bg-red-900/30',
      reserved: 'bg-amber-100 border-amber-500 dark:bg-amber-900/30',
      cleaning: 'bg-gray-100 border-gray-500 dark:bg-gray-900/30'
    };
    return colors[status] || colors.available;
  };

  const getTimeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
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
              <Utensils className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-foreground">Waiter Panel</h1>
              <p className="text-sm text-muted-foreground">Manage tables and deliveries</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {readyOrders.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full animate-pulse">
                <Bell className="w-4 h-4" />
                <span className="font-medium">{readyOrders.length} Ready</span>
              </div>
            )}
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'tables'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Tables
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'ready'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Package className="w-4 h-4" />
            Ready Orders
            {readyOrders.length > 0 && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === 'ready' ? 'bg-primary-foreground/20' : 'bg-primary text-primary-foreground'
              }`}>
                {readyOrders.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'tables' && (
          <>
            {/* Table Legend */}
            <div className="flex flex-wrap gap-4 mb-6 p-4 bg-card border border-border rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-sm text-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-sm text-foreground">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500"></div>
                <span className="text-sm text-foreground">Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-500"></div>
                <span className="text-sm text-foreground">Cleaning</span>
              </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {tables.length > 0 ? (
                tables.map((table) => (
                  <div
                    key={table.id}
                    className={`border-2 rounded-xl p-4 text-center cursor-pointer hover:shadow-md transition-all ${getTableStatusColor(table.status)}`}
                  >
                    <p className="text-2xl font-bold text-foreground mb-1">{table.number}</p>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-2">
                      <Users className="w-4 h-4" />
                      <span>{table.capacity}</span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      table.status === 'available' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' :
                      table.status === 'occupied' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                      table.status === 'reserved' ? 'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200' :
                      'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}>
                      {table.status}
                    </span>
                    {table.current_order && (
                      <div className="mt-2 pt-2 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">Order #{table.current_order}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No tables configured</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'ready' && (
          <div className="space-y-4">
            {readyOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-foreground mb-2">No orders ready</h3>
                <p className="text-muted-foreground">Orders will appear here when ready for delivery</p>
              </div>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card border border-green-500 rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-foreground">Order #{order.id}</span>
                        <span className="px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded-full">
                          Ready
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Ready {getTimeSince(order.ready_at || order.updated_at)} ago
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      {order.order_type === 'dine-in' ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-lg">
                          <MapPin className="w-4 h-4" />
                          Table {order.table_number}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-lg">
                          <Package className="w-4 h-4" />
                          Takeaway - {order.customer_name}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items?.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleDeliverOrder(order.id)}
                      disabled={updating === order.id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {updating === order.id ? 'Marking...' : 'Mark as Delivered'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
