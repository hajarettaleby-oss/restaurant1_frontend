import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Calendar, Search, Clock, Users, MapPin, ChevronDown, Eye } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await adminAPI.getAllReservations();
      setReservations(response.data?.reservations || []);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    setUpdating(true);
    try {
      await adminAPI.updateReservationStatus(reservationId, newStatus);
      setReservations(prev =>
        prev.map(res =>
          res.id === reservationId ? { ...res, status: newStatus } : res
        )
      );
      if (selectedReservation?.id === reservationId) {
        setSelectedReservation(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Failed to update reservation status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'no-show': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    };
    return colors[status] || colors.pending;
  };

  const statuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'];

  const filteredReservations = reservations.filter(res => {
    const matchesFilter = filter === 'all' || res.status === filter;
    const matchesSearch = search === '' ||
      res.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      res.id?.toString().includes(search);
    const matchesDate = selectedDate === '' || res.reservation_date === selectedDate;
    return matchesFilter && matchesSearch && matchesDate;
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
          <h1 className="text-2xl font-serif font-bold text-foreground">Reservation Management</h1>
          <p className="text-muted-foreground">View and manage all table reservations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reservations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
        />
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
          {['pending', 'confirmed', 'completed'].map((status) => (
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

      {/* Reservations Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Party Size</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Table</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReservations.length > 0 ? (
                filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">#{reservation.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{reservation.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{reservation.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {new Date(reservation.reservation_date).toLocaleDateString()}
                        </span>
                        <Clock className="w-4 h-4 text-muted-foreground ml-2" />
                        <span className="text-foreground">
                          {reservation.reservation_time?.slice(0, 5)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-foreground">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {reservation.party_size}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {reservation.table_number ? (
                        <div className="flex items-center gap-2 text-foreground">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          Table {reservation.table_number}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={reservation.status}
                          onChange={(e) => handleStatusUpdate(reservation.id, e.target.value)}
                          disabled={updating}
                          className={`appearance-none px-3 py-1 pr-8 rounded-full text-sm font-medium cursor-pointer ${getStatusColor(reservation.status)}`}
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
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedReservation(reservation)}
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
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No reservations found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Details Modal */}
      <Modal
        isOpen={!!selectedReservation}
        onClose={() => setSelectedReservation(null)}
        title={`Reservation #${selectedReservation?.id}`}
      >
        {selectedReservation && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{selectedReservation.customer_name}</p>
                <p className="text-sm text-muted-foreground">{selectedReservation.customer_email}</p>
                {selectedReservation.customer_phone && (
                  <p className="text-sm text-muted-foreground">{selectedReservation.customer_phone}</p>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedReservation.status)}`}>
                {selectedReservation.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedReservation.reservation_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium text-foreground">
                    {selectedReservation.reservation_time?.slice(0, 5)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Party Size</p>
                  <p className="font-medium text-foreground">
                    {selectedReservation.party_size} guests
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Table</p>
                  <p className="font-medium text-foreground">
                    {selectedReservation.table_number 
                      ? `Table ${selectedReservation.table_number}` 
                      : 'Not assigned'}
                  </p>
                </div>
              </div>
            </div>

            {selectedReservation.special_requests && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Special Requests</h4>
                <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {selectedReservation.special_requests}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-border">
              <select
                value={selectedReservation.status}
                onChange={(e) => handleStatusUpdate(selectedReservation.id, e.target.value)}
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
                onClick={() => setSelectedReservation(null)}
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
