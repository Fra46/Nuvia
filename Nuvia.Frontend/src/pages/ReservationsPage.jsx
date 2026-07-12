import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, CircleCheckBig, Clock3, Hotel, Map, Package, Plane, XCircle } from 'lucide-react';
import bookingsService from '../services/bookingsService';

function getTypeInfo(booking) {
  if (booking.flightId) return { label: 'Vuelo', Icon: Plane };
  if (booking.hotelId) return { label: 'Hotel', Icon: Hotel };
  if (booking.tourId) return { label: 'Tour', Icon: Map };
  if (booking.packageId) return { label: 'Paquete', Icon: Package };
  return { label: '—', Icon: Package };
}

function getStatusBadge(status) {
  if (status === 2 || status === 'Confirmed') {
    return { label: 'Confirmada', className: 'bg-success-subtle text-success', Icon: CircleCheckBig };
  }
  if (status === 3 || status === 'Cancelled') {
    return { label: 'Cancelada', className: 'bg-danger-subtle text-danger', Icon: XCircle };
  }
  return { label: 'Pendiente', className: 'bg-warning-subtle text-warning', Icon: Clock3 };
}

function formatCOP(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function ReservationsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await bookingsService.getMyBookings();
        setBookings(data || []);
      } catch (err) {
        setError(err?.message || 'No se pudieron cargar las reservas');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)),
    [bookings],
  );

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'all') return sortedBookings;
    return sortedBookings.filter((b) => getStatusBadge(b.status).label.toLowerCase() === statusFilter);
  }, [sortedBookings, statusFilter]);

  return (
    <main className="container-xl py-5" style={{ paddingTop: '7rem' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
        <h1 className="font-heading fw-semibold lh-sm mb-0">Mis reservas</h1>

        {bookings.length > 0 && (
          <select
            className="form-select form-select-sm border-nv"
            style={{ maxWidth: '12rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmada">Confirmadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        )}
      </div>

      {loading && (
        <div className="nv-card d-flex flex-column align-items-center justify-content-center text-center py-5 mt-4">
          <p className="text-muted-nv mb-0">Cargando tus reservas...</p>
        </div>
      )}

      {!loading && error && <p className="text-danger mt-4">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div className="nv-card d-flex flex-column align-items-center justify-content-center text-center py-5 mt-4">
          <span className="icon-circle bg-sand text-teal" style={{ width: '4rem', height: '4rem' }}>
            <CalendarClock size={32} />
          </span>
          <h2 className="font-heading fs-3 fw-semibold mt-4">Aún no tienes reservas</h2>
          <p className="text-muted-nv mb-0">Cuando reserves un viaje, aparecerá aquí.</p>
          <Link to="/packages" className="btn btn-teal rounded-pill px-4 mt-3">Explorar paquetes</Link>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="row g-3 mt-2">
          {filteredBookings.map((booking) => {
            const { label: typeLabel, Icon } = getTypeInfo(booking);
            const status = getStatusBadge(booking.status);
            const StatusIcon = status.Icon;

            return (
              <div key={booking.id} className="col-12 col-lg-6">
                <Link to={`/bookings/${booking.id}`} className="text-decoration-none">
                  <div className="nv-card p-4 h-100">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="icon-circle bg-sand text-teal" style={{ width: '2.5rem', height: '2.5rem' }}>
                          <Icon size={18} />
                        </span>
                        <div>
                          <div className="fw-semibold" style={{ color: 'var(--nv-ink)' }}>
                            {booking.bookingCode}
                          </div>
                          <div className="small text-muted-nv">{typeLabel} · Cantidad: {booking.quantity}</div>
                        </div>
                      </div>
                      <span className={`badge rounded-pill d-inline-flex align-items-center gap-2 ${status.className}`}>
                        <StatusIcon size={14} /> {status.label}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-end mt-3 pt-3 border-top border-nv">
                      <span className="small text-muted-nv">
                        {new Date(booking.bookingDate).toLocaleDateString('es-CO', { dateStyle: 'medium' })}
                      </span>
                      <span className="font-heading fs-5 fw-semibold text-teal">
                        {formatCOP(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}

          {filteredBookings.length === 0 && (
            <p className="text-muted-nv mt-3">No hay reservas con ese estado.</p>
          )}
        </div>
      )}
    </main>
  );
}