import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CircleCheckBig, Mail, Phone, ShieldCheck } from 'lucide-react';
import usersService from '../services/usersService';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await usersService.getMe();
        setUser(data);
      } catch (err) {
        setError(err?.message || 'No se pudo cargar tu perfil');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <main className="container-xl py-5">
      <Link to="/" className="d-inline-flex align-items-center gap-2 small fw-medium text-muted-nv text-decoration-none">
        <ArrowLeft size={16} /> Volver al inicio
      </Link>

      <h1 className="font-heading fw-semibold lh-sm mt-3 mb-4">Mi perfil</h1>

      {loading && <p className="text-muted-nv">Cargando tu información...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && user && (
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <div className="nv-card p-4">
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div>
                  <p className="text-uppercase-xs text-amber mb-2">Información personal</p>
                  <h2 className="font-heading fs-3 fw-semibold mb-1">{user.fullName}</h2>
                  <p className="text-muted-nv mb-0">{user.email}</p>
                </div>
                <span className="badge rounded-pill bg-teal-subtle text-teal px-3 py-2">
                  {user.role || 'Cliente'}
                </span>
              </div>

              <div className="mt-4 d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-2 text-muted-nv">
                  <Mail size={18} />
                  <span>{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="d-flex align-items-center gap-2 text-muted-nv">
                    <Phone size={18} />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                <div className="d-flex align-items-center gap-2 text-muted-nv">
                  <ShieldCheck size={18} />
                  <span>{user.emailVerified ? 'Correo verificado' : 'Correo sin verificar'}</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted-nv">
                  <CircleCheckBig size={18} />
                  <span>{user.isActive ? 'Cuenta activa' : 'Cuenta inactiva'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-5">
            <div className="nv-card p-4">
              <p className="text-uppercase-xs text-amber mb-2">Acciones rápidas</p>
              <div className="d-grid gap-2">
                <Link to="/reservations" className="btn btn-light border-nv rounded-pill">Ver mis reservas</Link>
                <Link to="/favorites" className="btn btn-light border-nv rounded-pill">Ver favoritos</Link>
                <Link to="/cart" className="btn btn-teal rounded-pill">Ir al carrito</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
