import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import paymentsService from '../services/paymentsService';

const POLL_ATTEMPTS = 5;
const POLL_DELAY_MS = 2000;

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');

  const [payment, setPayment] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!paymentId) {
      setChecking(false);
      return () => {
        cancelled = true;
      };
    }

    const poll = async () => {
      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
        try {
          const data = await paymentsService.getMyPayment(paymentId);
          if (cancelled) return;
          setPayment(data);

          // El webhook de Stripe confirma el pago de forma asíncrona.
          // Si ya llegó como "Approved" (2), dejamos de consultar.
          if (data?.status === 2 || data?.status === 'Approved') {
            setChecking(false);
            return;
          }
        } catch {
          // seguimos intentando
        }
        await new Promise((resolve) => setTimeout(resolve, POLL_DELAY_MS));
      }
      if (!cancelled) setChecking(false);
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  return (
    <main className="container-xl" style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-6">
          <div className="nv-card d-flex flex-column align-items-center text-center p-4 p-md-5">
            <span className="icon-circle bg-amber text-white" style={{ width: '4rem', height: '4rem' }}>
              <Check size={32} />
            </span>
            <h1 className="font-heading fw-semibold fs-2 mt-4">¡Gracias por tu compra!</h1>

            {checking ? (
              <p className="text-muted-nv d-flex align-items-center gap-2 mt-2 mb-0">
                <Loader2 size={16} className="spin" /> Confirmando tu pago con Stripe...
              </p>
            ) : payment?.status === 2 || payment?.status === 'Approved' ? (
              <p className="text-muted-nv mt-2 mb-0" style={{ maxWidth: '24rem' }}>
                Tu pago fue aprobado y tu reserva quedó confirmada. Te enviamos el recibo por correo.
              </p>
            ) : (
              <p className="text-muted-nv mt-2 mb-0" style={{ maxWidth: '26rem' }}>
                Recibimos tu pago y lo estamos confirmando. Esto puede tardar unos segundos; si no ves la
                confirmación, revisa tu correo o la sección de reservas más tarde.
              </p>
            )}

            <Link to="/" className="btn btn-teal rounded-pill px-4 mt-4">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
