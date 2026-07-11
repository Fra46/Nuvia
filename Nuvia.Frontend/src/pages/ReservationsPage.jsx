import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bookingsService from '../services/bookingsService';
import { useAuth } from '../context/AuthContext';

export default function ReservationsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <main className="container-xl py-5">
      <h1 className="mb-4">Mis reservas</h1>

      {loading && <p className="text-muted-nv">Cargando reservas...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && bookings.length === 0 && (
        <div className="alert alert-info">No has hecho reservas aún.</div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="list-group">
          {bookings.map((b) => (
            <Link key={b.id} to={`/bookings/${b.id}`} className="list-group-item list-group-item-action mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">Código: {b.bookingCode}</div>
                  <div className="text-muted small">Fecha: {new Date(b.bookingDate).toLocaleString()}</div>
                </div>
                <div className="text-end">
                  <div className="fw-semibold">{b.totalPrice?.toLocaleString?.() ?? b.totalPrice} USD</div>
                  <div className="small text-muted">Estado: {b.status}</div>
                </div>
              </div>
              <div className="mt-2 small text-muted">
                Tipo: {b.flightId ? 'Vuelo' : b.hotelId ? 'Hotel' : b.tourId ? 'Tour' : b.packageId ? 'Paquete' : '—'} • Cantidad: {b.quantity}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
