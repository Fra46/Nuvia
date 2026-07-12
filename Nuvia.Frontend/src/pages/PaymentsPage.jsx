import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, CircleDollarSign, CreditCard, Download, XCircle } from 'lucide-react';
import paymentsService from '../services/paymentsService';

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getStatusLabel(status) {
  if (status === 2 || status === 'Approved') return 'Aprobado';
  if (status === 3 || status === 'Rejected') return 'Rechazado';
  return 'Pendiente';
}

function exportReceipt(payment) {
  const lines = [
    'Nuvia - Comprobante de pago',
    `ID: ${payment.id}`,
    `Reserva: ${payment.bookingId || 'N/A'}`,
    `Monto: ${payment.amount || 0}`,
    `Estado: ${getStatusLabel(payment.status)}`,
    `Fecha: ${new Date(payment.createdAt || Date.now()).toLocaleString('es-CO')}`,
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `comprobante-${payment.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await paymentsService.getMyPayments();
        setPayments(data || []);
      } catch (err) {
        setError(err?.message || 'No se pudo cargar el historial de pagos');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredPayments = useMemo(() => {
    const sorted = [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (statusFilter === 'all') return sorted;
    return sorted.filter((p) => getStatusLabel(p.status).toLowerCase() === statusFilter);
  }, [payments, statusFilter]);

  return (
    <main className="container-xl py-5">
      <Link to="/" className="d-inline-flex align-items-center gap-2 small fw-medium text-muted-nv text-decoration-none">
        <ArrowLeft size={16} /> Volver al inicio
      </Link>

      <div className="nv-card p-4 p-md-5 mt-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <p className="text-uppercase-xs text-amber mb-2">Historial de pagos</p>
            <h1 className="font-heading fw-semibold lh-sm mb-0">Seguimiento seguro de tus compras</h1>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="d-inline-flex align-items-center gap-2 rounded-pill border border-nv px-3 py-2 text-muted-nv">
              <CreditCard size={16} />
              <span>Stripe + reservas</span>
            </div>
            {payments.length > 0 && (
              <select
                className="form-select form-select-sm border-nv"
                style={{ maxWidth: '11rem' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="aprobado">Aprobados</option>
                <option value="pendiente">Pendientes</option>
                <option value="rechazado">Rechazados</option>
              </select>
            )}
          </div>
        </div>

        {loading && <p className="text-muted-nv mt-4">Cargando pagos...</p>}
        {error && <p className="text-danger mt-4">{error}</p>}

        {!loading && !error && payments.length === 0 && (
          <div className="alert alert-info mt-4">Aún no tienes pagos registrados.</div>
        )}

        {!loading && !error && payments.length > 0 && filteredPayments.length === 0 && (
          <div className="alert alert-light border-nv mt-4">No hay pagos con ese estado.</div>
        )}

        {!loading && !error && filteredPayments.length > 0 && (
          <div className="row g-3 mt-2">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="col-12 col-lg-6">
                <div className="border border-nv rounded-4 p-4 h-100">
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <div className="fw-semibold">Pago #{payment.id}</div>
                      <Link to={`/bookings/${payment.bookingId}`} className="small text-teal text-decoration-none">
                        Reserva #{payment.bookingId}
                      </Link>
                    </div>
                    <span className={`badge rounded-pill d-inline-flex align-items-center gap-2 ${payment.status === 2 || payment.status === 'Approved' ? 'bg-success-subtle text-success' : payment.status === 3 || payment.status === 'Rejected' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning'}`}>
                      {payment.status === 2 || payment.status === 'Approved' ? <CheckCircle2 size={14} /> : payment.status === 3 || payment.status === 'Rejected' ? <XCircle size={14} /> : <CircleDollarSign size={14} />}
                      {getStatusLabel(payment.status)}
                    </span>
                  </div>

                  <div className="mt-3 d-flex align-items-center gap-2 text-muted-nv">
                    <CreditCard size={16} />
                    <span>{payment.method === 2 || payment.method === 'Stripe' ? 'Stripe' : 'Simulado'}</span>
                  </div>

                  <div className="mt-3">
                    <div className="font-heading fs-4 fw-semibold">{formatCurrency(payment.amount)}</div>
                    <div className="small text-muted-nv">{new Date(payment.createdAt).toLocaleString()}</div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-light border-nv rounded-pill mt-3 d-inline-flex align-items-center gap-2"
                    onClick={() => exportReceipt(payment)}
                  >
                    <Download size={16} /> Descargar comprobante
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}