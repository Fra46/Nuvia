import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import bookingsService from '../services/bookingsService';

export default function BookingDetailsPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await bookingsService.getBooking(id);
        setBooking(data);
      } catch (err) {
        setError(err?.message || 'No se pudo cargar la reserva');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <main className="container-xl py-5"><p className="text-muted-nv">Cargando...</p></main>;
  if (error) return <main className="container-xl py-5"><p className="text-danger">{error}</p></main>;
  if (!booking) return <main className="container-xl py-5"><div className="alert alert-warning">Reserva no encontrada.</div></main>;

  const exportBookingReceipt = () => {
    const lines = [
      'Nuvia - Comprobante de reserva',
      `Reserva: ${booking.bookingCode}`,
      `ID de reserva: ${booking.id}`,
      `Tipo: ${booking.flightId ? 'Vuelo' : booking.hotelId ? 'Hotel' : booking.tourId ? 'Tour' : booking.packageId ? 'Paquete' : '—'}`,
      `Cantidad: ${booking.quantity}`,
      `Total: ${booking.totalPrice} USD`,
      `Estado: ${booking.status}`,
      `Fecha de reserva: ${new Date(booking.bookingDate).toLocaleString()}`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reserva-${booking.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="container-xl py-5">
      <h1 className="mb-3">Reserva {booking.bookingCode}</h1>
      <div className="mb-3 small text-muted">Fecha: {new Date(booking.bookingDate).toLocaleString()}</div>

      <div className="nv-card p-4 mb-3">
        <h5>Detalles</h5>
        <table className="table">
          <tbody>
            <tr><th scope="row">ID</th><td>{booking.id}</td></tr>
            <tr><th scope="row">Código</th><td>{booking.bookingCode}</td></tr>
            <tr><th scope="row">Usuario</th><td>{booking.userId}</td></tr>
            <tr><th scope="row">Tipo</th><td>{booking.flightId ? 'Vuelo' : booking.hotelId ? 'Hotel' : booking.tourId ? 'Tour' : booking.packageId ? 'Paquete' : '—'}</td></tr>
            <tr><th scope="row">Cantidad</th><td>{booking.quantity}</td></tr>
            <tr><th scope="row">Precio total</th><td>{booking.totalPrice} USD</td></tr>
            <tr><th scope="row">Estado</th><td>{booking.status}</td></tr>
          </tbody>
        </table>

        <button type="button" onClick={exportBookingReceipt} className="btn btn-light border-nv rounded-pill mt-3 d-inline-flex align-items-center gap-2">
          <Download size={16} /> Descargar comprobante de reserva
        </button>
      </div>

      <Link to="/reservations" className="btn btn-light border-nv">Volver a Mis reservas</Link>
    </main>
  );
}
