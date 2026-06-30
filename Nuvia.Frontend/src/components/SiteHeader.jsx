import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, ShoppingBag, X } from 'lucide-react';
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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand">
          <span className="site-header__logo">N</span>
          <span>Nuvia</span>
        </Link>

        <nav className="site-header__nav">
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href} className={({ isActive }) => isActive ? 'active' : ''}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <Link to="/packages" className="btn btn-primary site-header__plan-button">
            Planea tu viaje
          </Link>
          <Link to="/cart" className="site-header__cart" aria-label="Carrito">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span className="site-header__badge">{count}</span>}
          </Link>
          {user ? (
            <button onClick={logout} className="btn btn-outline site-header__auth-button">
              Salir
            </button>
          ) : (
            <Link to="/login" className="btn btn-outline site-header__auth-button">
              Login
            </Link>
          )}
          <button className="site-header__toggle" onClick={() => setOpen((value) => !value)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="site-header__mobile-nav">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} className="site-header__mobile-link" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link to="/packages" className="site-header__button" onClick={() => setOpen(false)}>
            Planea tu viaje
          </Link>
          {user ? (
            <button
              className="site-header__button site-header__button--logout"
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              Salir
            </button>
          ) : (
            <Link to="/login" className="site-header__button" onClick={() => setOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
