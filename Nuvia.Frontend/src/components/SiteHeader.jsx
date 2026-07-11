import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Cloud, Menu, ShoppingBag, X, User, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/flights', label: 'Vuelos' },
  { href: '/hotels', label: 'Hoteles' },
  { href: '/tours', label: 'Tours' },
  { href: '/packages', label: 'Paquetes' },
];

export default function SiteHeader() {
  const location = useLocation();
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userMenuOpen]);

  return (
    <header className={`nv-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-xl">
        <div className="d-flex align-items-center justify-content-between gap-3" style={{ height: '4.5rem' }}>
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none" aria-label="Nuvia inicio">
            <span className="brand-mark">
              <Cloud size={20} fill="currentColor" strokeWidth={1.5} />
            </span>
            <span className="font-heading fw-semibold fs-3 lh-1" style={{ color: 'var(--nv-ink)' }}>
              Nuvia
            </span>
          </Link>

          <nav className="d-none d-lg-flex align-items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="d-flex align-items-center gap-2">
            <Link to="/packages" className="btn btn-teal rounded-pill px-4 d-none d-sm-inline-flex fw-medium">
              Planea tu viaje
            </Link>

            {user ? (
              <div ref={userMenuRef} className="position-relative d-none d-md-inline-block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="btn btn-light border-nv user-btn d-inline-flex align-items-center gap-2 fw-medium"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="user-avatar">
                    <User size={16} />
                  </span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div className="dropdown-menu show shadow-sm" style={{ right: 0, left: 'auto', position: 'absolute', transform: 'translateY(8px)', minWidth: '13rem', borderRadius: '0.75rem', overflow: 'hidden' }}>
                      <Link to="/profile" className="dropdown-item">Perfil</Link>
                      <Link to="/reservations" className="dropdown-item">Mis reservas</Link>
                    {(() => {
                      const role = String(user?.role ?? user?.Role ?? '').toLowerCase();
                      if (role === 'admin' || role === '1') {
                        return <Link to="/admin" className="dropdown-item">Admin</Link>;
                      }
                      return null;
                    })()}
                    <div className="dropdown-divider"></div>
                    <button type="button" className="dropdown-item" onClick={() => { setUserMenuOpen(false); logout(); }}>Cerrar Sesión</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-light border-nv rounded-pill px-3 d-none d-md-inline-flex fw-medium">
                Iniciar Sesión
              </Link>
            )}

            <Link
              to="/cart"
              className="btn btn-light border-nv rounded-circle position-relative d-inline-flex align-items-center justify-content-center p-0"
              style={{ width: '2.75rem', height: '2.75rem' }}
              aria-label="Carrito"
            >
              <ShoppingBag size={20} />
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="btn btn-light border-nv rounded-circle d-inline-flex d-lg-none align-items-center justify-content-center p-0"
              style={{ width: '2.75rem', height: '2.75rem' }}
              aria-label="Menú"
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="d-lg-none border-top border-nv bg-cream">
          <nav className="container-xl d-flex flex-column gap-1 py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  `rounded-3 px-3 py-2 text-decoration-none fw-medium ${isActive ? 'bg-sand text-teal' : 'text-body'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/packages" className="btn btn-teal rounded-pill mt-2 fw-medium">
              Planea tu viaje
            </Link>
            {user ? (
              <div className="d-flex flex-column gap-1">
                <Link to="/profile" className="text-decoration-none px-3 py-2">Perfil</Link>
                <Link to="/reservations" className="text-decoration-none px-3 py-2">Mis reservas</Link>
                {(() => {
                  const role = String(user?.role ?? user?.Role ?? '').toLowerCase();
                  if (role === 'admin' || role === '1') {
                    return <Link to="/admin" className="text-decoration-none px-3 py-2">Admin</Link>;
                  }
                  return null;
                })()}
                <button type="button" onClick={logout} className="btn btn-light border-nv rounded-pill mt-2 fw-medium">Cerrar Sesión</button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-light border-nv rounded-pill mt-2 fw-medium">
                Iniciar Sesión
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
