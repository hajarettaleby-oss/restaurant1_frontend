import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ordersAPI, reservationsAPI } from '../../services/api';
import { ShoppingBag, Calendar, Clock, ChevronRight, Package, Star } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function ClientDashboard() {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [recentOrders, setRecentOrders] = useState([]);
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, reservationsRes] = await Promise.all([
        ordersAPI.getMyOrders(),
        reservationsAPI.getMyReservations()
      ]);

      const orders = ordersRes.data || [];
      const reservations = reservationsRes.data || [];

      setRecentOrders(orders.slice(0, 3));
      setUpcomingReservations(
        reservations
          .filter(r => new Date(r.reservation_date) >= new Date() && r.status !== 'cancelled')
          .slice(0, 3)
      );

      const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
      setStats({
        totalOrders: orders.length,
        totalSpent,
        loyaltyPoints: Math.floor(totalSpent / 10)
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
          Welcome back, {user?.first_name || 'Guest'}
        </h1>
        <p className="text-muted-foreground">
          Manage your orders, reservations, and account settings from your personal dashboard.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-foreground">${stats.totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Star className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loyalty Points</p>
              <p className="text-2xl font-bold text-foreground">{stats.loyaltyPoints}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/menu"
          className="flex flex-col items-center gap-3 p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <span className="font-medium text-foreground">Order Food</span>
        </Link>

        <Link
          to="/reservation"
          className="flex flex-col items-center gap-3 p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <span className="font-medium text-foreground">Reserve Table</span>
        </Link>

        <Link
          to="/cart"
          className="flex flex-col items-center gap-3 p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all group relative"
        >
          <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors relative">
            <ShoppingBag className="w-6 h-6 text-primary" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span className="font-medium text-foreground">View Cart</span>
        </Link>

        <Link
          to="/dashboard/orders"
          className="flex flex-col items-center gap-3 p-6 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <span className="font-medium text-foreground">Track Orders</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-serif font-semibold text-foreground">Recent Orders</h2>
            <Link
              to="/dashboard/orders"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Order #{order.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    <span className="font-medium text-foreground">${parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
                <Link to="/menu" className="text-primary hover:underline text-sm">
                  Browse our menu
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Reservations */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-serif font-semibold text-foreground">Upcoming Reservations</h2>
            <Link
              to="/dashboard/reservations"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {upcomingReservations.length > 0 ? (
              upcomingReservations.map((reservation) => (
                <div key={reservation.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">
                      {new Date(reservation.reservation_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {reservation.reservation_time?.slice(0, 5)}
                    </span>
                    <span>{reservation.number_of_guests} guests</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming reservations</p>
                <Link to="/reservation" className="text-primary hover:underline text-sm">
                  Make a reservation
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
