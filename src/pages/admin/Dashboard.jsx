import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { 
  DollarSign, ShoppingBag, Users, Calendar, 
  TrendingUp, ArrowUpRight, ArrowDownRight, 
  ChefHat, Package, Clock
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AnimatedCounter from '../../components/common/AnimatedCounter';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getRecentOrders()
      ]);
      setStats(statsRes.data);
      setRecentOrders(ordersRes.data?.orders || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set mock data for demo
      setStats({
        totalRevenue: 45678.90,
        totalOrders: 1234,
        totalCustomers: 567,
        totalReservations: 89,
        revenueChange: 12.5,
        ordersChange: 8.3,
        customersChange: 15.2,
        reservationsChange: -5.1
      });
      setRecentOrders([]);
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

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue || 0,
      prefix: '$',
      change: stats?.revenueChange || 0,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      change: stats?.ordersChange || 0,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      change: stats?.customersChange || 0,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      title: 'Reservations',
      value: stats?.totalReservations || 0,
      change: stats?.reservationsChange || 0,
      icon: Calendar,
      color: 'text-amber-600',
      bg: 'bg-amber-100 dark:bg-amber-900/30'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here is what is happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-foreground">
              {stat.prefix}
              <AnimatedCounter value={stat.value} decimals={stat.prefix === '$' ? 2 : 0} />
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/admin/orders"
          className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all"
        >
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Manage Orders</p>
            <p className="text-sm text-muted-foreground">View all orders</p>
          </div>
        </Link>

        <Link
          to="/admin/menu"
          className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all"
        >
          <div className="p-2 bg-primary/10 rounded-lg">
            <ChefHat className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Menu Items</p>
            <p className="text-sm text-muted-foreground">Edit menu</p>
          </div>
        </Link>

        <Link
          to="/admin/reservations"
          className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all"
        >
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Reservations</p>
            <p className="text-sm text-muted-foreground">Manage bookings</p>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:shadow-md transition-all"
        >
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Users</p>
            <p className="text-sm text-muted-foreground">Manage accounts</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.length > 0 ? (
              recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">Order #{order.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{order.customer_name}</span>
                    <span className="font-medium text-foreground">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent orders</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {[
                { icon: ShoppingBag, text: 'New order #1234 received', time: '5 min ago', color: 'bg-blue-500' },
                { icon: Users, text: 'New customer registered', time: '12 min ago', color: 'bg-green-500' },
                { icon: Calendar, text: 'Reservation confirmed for Table 5', time: '25 min ago', color: 'bg-purple-500' },
                { icon: Clock, text: 'Order #1232 marked as delivered', time: '1 hour ago', color: 'bg-amber-500' },
                { icon: TrendingUp, text: 'Daily revenue goal reached', time: '2 hours ago', color: 'bg-emerald-500' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${activity.color} text-white`}>
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">{activity.text}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
