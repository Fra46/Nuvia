import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <main className="container-xl" style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-6">
          <div className="nv-card d-flex flex-column align-items-center text-center p-4 p-md-5">
            <span className="icon-circle bg-sand text-teal" style={{ width: '4rem', height: '4rem' }}>
              <X size={32} />
            </span>
            <h1 className="font-heading fw-semibold fs-2 mt-4">Pago cancelado</h1>
            <p className="text-muted-nv mt-2 mb-0" style={{ maxWidth: '24rem' }}>
              No se realizó ningún cargo. Puedes volver a tu carrito e intentarlo de nuevo cuando quieras.
            </p>
            <Link to="/cart" className="btn btn-teal rounded-pill px-4 mt-4">
              Volver al carrito
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
