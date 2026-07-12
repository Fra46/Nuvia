import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CircleCheckBig, Clock3, Download, XCircle } from 'lucide-react';
import bookingsService from '../services/bookingsService';

function getStatusBadge(status) {
  if (status === 2 || status === 'Confirmed') {
    return { label: 'Confirmada', className: 'bg-success-subtle text-success', Icon: CircleCheckBig };
  }
  if (status === 3 || status === 'Cancelled') {
    return { label: 'Cancelada', className: 'bg-danger-subtle text-danger', Icon: XCircle };
  }
  return { label: 'Pendiente', className: 'bg-warning-subtle text-warning', Icon: Clock3 };
}

function getTypeLabel(booking) {
  if (booking.flightId) return 'Vuelo';
  if (booking.hotelId) return 'Hotel';
  if (booking.tourId) return 'Tour';
  if (booking.packageId) return 'Paquete';
  return '—';
}

function formatCOP(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

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

  const exportBookingReceipt = () => {
    const lines = [
      'Nuvia - Comprobante de reserva',
      `Reserva: ${booking.bookingCode}`,
      `ID de reserva: ${booking.id}`,
      `Tipo: ${getTypeLabel(booking)}`,
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

  if (loading) {
    return (
      <main className="container-xl py-5" style={{ paddingTop: '7rem' }}>
        <p className="text-muted-nv">Cargando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container-xl py-5" style={{ paddingTop: '7rem' }}>
        <p className="text-danger">{error}</p>
        <Link to="/reservations" className="btn btn-light border-nv rounded-pill">Volver a Mis reservas</Link>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="container-xl py-5" style={{ paddingTop: '7rem' }}>
        <div className="alert alert-warning">Reserva no encontrada.</div>
        <Link to="/reservations" className="btn btn-light border-nv rounded-pill">Volver a Mis reservas</Link>
      </main>
    );
  }

  const status = getStatusBadge(booking.status);
  const StatusIcon = status.Icon;

  return (
    <main className="container-xl py-5" style={{ paddingTop: '7rem' }}>
      <Link to="/reservations" className="d-inline-flex align-items-center gap-2 small fw-medium text-muted-nv text-decoration-none">
        <ArrowLeft size={16} /> Volver a Mis reservas
      </Link>

      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
        <h1 className="font-heading fw-semibold lh-sm mb-0">Reserva {booking.bookingCode}</h1>
        <span className={`badge rounded-pill d-inline-flex align-items-center gap-2 ${status.className}`}>
          <StatusIcon size={14} /> {status.label}
        </span>
      </div>
      <div className="mb-3 small text-muted-nv">
        Fecha: {new Date(booking.bookingDate).toLocaleString()}
      </div>

      <div className="nv-card p-4 mb-3">
        <h2 className="font-heading fs-5 fw-semibold mb-3">Detalles</h2>
        <table className="table mb-0">
          <tbody>
            <tr><th scope="row">Código</th><td>{booking.bookingCode}</td></tr>
            <tr><th scope="row">Tipo</th><td>{getTypeLabel(booking)}</td></tr>
            <tr><th scope="row">Cantidad</th><td>{booking.quantity}</td></tr>
            <tr><th scope="row">Precio total</th><td>{formatCOP(booking.totalPrice)}</td></tr>
            <tr><th scope="row">Estado</th><td>{status.label}</td></tr>
          </tbody>
        </table>

        <button
          type="button"
          onClick={exportBookingReceipt}
          className="btn btn-light border-nv rounded-pill mt-3 d-inline-flex align-items-center gap-2"
        >
          <Download size={16} /> Descargar comprobante de reserva
        </button>
      </div>

      <Link to="/payments" className="btn btn-teal rounded-pill px-4">Ver estado de pago</Link>
    </main>
  );
}