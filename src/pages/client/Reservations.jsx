import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reservationsAPI } from '../../services/api';
import { Calendar, Clock, Users, MapPin, X, Plus, Edit2 } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

export default function ClientReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  const [cancelModal, setCancelModal] = useState({ open: false, reservation: null });
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await reservationsAPI.getMyReservations();
      setReservations(response.data || []);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!cancelModal.reservation) return;
    
    setCancelling(true);
    try {
      await reservationsAPI.cancel(cancelModal.reservation.id);
      setReservations(prev =>
        prev.map(r =>
          r.id === cancelModal.reservation.id ? { ...r, status: 'cancelled' } : r
        )
      );
      setCancelModal({ open: false, reservation: null });
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
    } finally {
      setCancelling(false);
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

  const filteredReservations = reservations.filter(reservation => {
    const reservationDate = new Date(reservation.reservation_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') {
      return reservationDate >= today && reservation.status !== 'cancelled';
    }
    if (filter === 'past') {
      return reservationDate < today || reservation.status === 'completed';
    }
    if (filter === 'cancelled') {
      return reservation.status === 'cancelled';
    }
    return true;
  });

  const canModify = (reservation) => {
    const reservationDate = new Date(reservation.reservation_date);
    const today = new Date();
    return reservationDate > today && !['cancelled', 'completed', 'no-show'].includes(reservation.status);
  };

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
          <h1 className="text-2xl font-serif font-bold text-foreground">My Reservations</h1>
          <p className="text-muted-foreground">View and manage your table reservations</p>
        </div>

        <Link
          to="/reservation"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Reservation
        </Link>
      </div>

      <div className="flex gap-2">
        {['upcoming', 'past', 'cancelled', 'all'].map((f) => (
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

      {filteredReservations.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No reservations found</h3>
          <p className="text-muted-foreground mb-4">
            {filter === 'upcoming'
              ? "You don't have any upcoming reservations."
              : `No ${filter} reservations to display.`}
          </p>
          <Link
            to="/reservation"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Make a Reservation
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {new Date(reservation.reservation_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {reservation.reservation_time?.slice(0, 5)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {reservation.number_of_guests} guests
                      </span>
                      {reservation.table_number && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Table {reservation.table_number}
                        </span>
                      )}
                    </div>
                    {reservation.special_requests && (
                      <p className="mt-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                        Note: {reservation.special_requests}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                  
                  {canModify(reservation) && (
                    <div className="flex gap-2">
                      <Link
                        to={`/reservation?edit=${reservation.id}`}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        title="Edit reservation"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setCancelModal({ open: true, reservation })}
                        className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Cancel reservation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModal.open}
        onClose={() => setCancelModal({ open: false, reservation: null })}
        title="Cancel Reservation"
      >
        <div className="p-6">
          <p className="text-muted-foreground mb-6">
            Are you sure you want to cancel your reservation for{' '}
            <strong className="text-foreground">
              {cancelModal.reservation &&
                new Date(cancelModal.reservation.reservation_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
            </strong>
            {' '}at{' '}
            <strong className="text-foreground">
              {cancelModal.reservation?.reservation_time?.slice(0, 5)}
            </strong>
            ?
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setCancelModal({ open: false, reservation: null })}
              className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Keep Reservation
            </button>
            <button
              onClick={handleCancelReservation}
              disabled={cancelling}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
