import { useState, useEffect } from 'react';
import { staffAPI } from '../../services/api';
import { DollarSign, CreditCard, Banknote, Receipt, Search, CheckCircle, Clock, Printer } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

export default function CashierPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [todayStats, setTodayStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    cashPayments: 0,
    cardPayments: 0
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        staffAPI.getPendingPayments(),
        staffAPI.getCashierStats()
      ]);
      setOrders(ordersRes.data?.orders || []);
      setTodayStats(statsRes.data || {
        totalSales: 0,
        totalOrders: 0,
        cashPayments: 0,
        cardPayments: 0
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedOrder) return;
    setProcessing(true);

    try {
      await staffAPI.processPayment(selectedOrder.id, {
        payment_method: paymentMethod,
        amount: selectedOrder.total_amount
      });
      
      setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      setSelectedOrder(null);
      fetchData(); // Refresh stats
    } catch (error) {
      console.error('Failed to process payment:', error);
    } finally {
      setProcessing(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id?.toString().includes(search) ||
    order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
    order.table_number?.toString().includes(search)
  );

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
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-foreground">Cashier Panel</h1>
              <p className="text-sm text-muted-foreground">Process payments and manage bills</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Today Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-xl font-bold text-foreground">${todayStats.totalSales?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="text-xl font-bold text-foreground">{todayStats.totalOrders || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Banknote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cash</p>
                <p className="text-xl font-bold text-foreground">${todayStats.cashPayments?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Card</p>
                <p className="text-xl font-bold text-foreground">${todayStats.cardPayments?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or table..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Pending Payments */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Pending Payments</h2>
        
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <Receipt className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No pending payments</h3>
            <p className="text-muted-foreground">All orders have been processed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-foreground">Order #{order.id}</span>
                  {order.order_type === 'dine-in' ? (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-full">
                      Table {order.table_number}
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full">
                      Takeaway
                    </span>
                  )}
                </div>

                {order.customer_name && (
                  <p className="text-sm text-muted-foreground mb-3">{order.customer_name}</p>
                )}

                <div className="space-y-1 mb-4">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                      <span className="text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <p className="text-sm text-muted-foreground">+{order.items.length - 3} more items</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">${parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Process Payment - Order #${selectedOrder?.id}`}
        size="md"
      >
        {selectedOrder && (
          <div className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Order Summary</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                    <span className="text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t border-border">
                <span className="font-medium text-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  ${parseFloat(selectedOrder.total_amount).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Payment Method</h4>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Banknote className={`w-8 h-8 ${paymentMethod === 'cash' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`font-medium ${paymentMethod === 'cash' ? 'text-primary' : 'text-foreground'}`}>
                    Cash
                  </span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <CreditCard className={`w-8 h-8 ${paymentMethod === 'card' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`font-medium ${paymentMethod === 'card' ? 'text-primary' : 'text-foreground'}`}>
                    Card
                  </span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPayment}
                disabled={processing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {processing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                {processing ? 'Processing...' : 'Complete Payment'}
              </button>
            </div>

            {/* Print Receipt */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors">
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
