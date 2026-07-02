import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const socials = [
  {
    label: 'Instagram',
    path: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: 'Facebook',
    path: <path d="M15 4h-2a3 3 0 0 0-3 3v3H8v3h2v7h3v-7h2.5l.5-3h-3V7a1 1 0 0 1 1-1h2V4Z" />,
  },
  {
    label: 'X',
    path: <path d="M4 4l16 16M20 4L4 20" />,
  },
];

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/flights', label: 'Vuelos' },
  { href: '/hotels', label: 'Hoteles' },
  { href: '/tours', label: 'Tours' },
  { href: '/packages', label: 'Paquetes' },
];

export default function SiteFooter() {
  return (
    <footer className="bg-teal text-white mt-5">
      <div className="container-xl py-5">
        <div className="row g-4 g-lg-5">
          <div className="col-12 col-lg-4">
            <div className="d-flex align-items-center gap-2">
              <span
                className="icon-circle"
                style={{ width: '2.25rem', height: '2.25rem', backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M2 12c4-6 16-6 20 0-4 6-16 6-20 0Z" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3.2" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <span className="font-heading fw-semibold fs-3">Nuvia</span>
            </div>
            <p className="mt-3 text-white-50" style={{ maxWidth: '20rem', lineHeight: 1.6 }}>
              Vuelos, hoteles, tours y paquetes seleccionados a mano. Tu próximo viaje empieza aquí.
            </p>
            <div className="d-flex gap-2 mt-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="icon-circle text-white"
                  style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'rgba(255,255,255,0.1)' }}
                  aria-label={s.label}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {s.path}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h3 className="font-heading fs-5 fw-semibold">Explora</h3>
            <ul className="list-unstyled mt-3 d-flex flex-column gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-white-50 text-decoration-none footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-6 col-lg-3">
            <h3 className="font-heading fs-5 fw-semibold">Legal</h3>
            <ul className="list-unstyled mt-3 d-flex flex-column gap-2">
              <li><a href="#" className="text-white-50 text-decoration-none footer-link">Términos de servicio</a></li>
              <li><a href="#" className="text-white-50 text-decoration-none footer-link">Política de privacidad</a></li>
              <li><a href="#" className="text-white-50 text-decoration-none footer-link">Configuración de cookies</a></li>
            </ul>
          </div>

          <div className="col-12 col-lg-3">
            <h3 className="font-heading fs-5 fw-semibold">Contacto</h3>
            <ul className="list-unstyled mt-3 d-flex flex-column gap-3 text-white-50">
              <li className="d-flex align-items-center gap-2"><Mail size={16} className="text-amber" /> info@viajesnuvia.com</li>
              <li className="d-flex align-items-center gap-2"><Phone size={16} className="text-amber" /> +57 313 656 9828</li>
              <li className="d-flex align-items-center gap-2"><MapPin size={16} className="text-amber" /> Valledupar, Cesar, Colombia</li>
            </ul>
          </div>
        </div>

        <div
          className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 mt-5 pt-4 text-white-50 small"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
        >
          <p className="mb-0">&copy; 2025 Nuvia. Todos los derechos reservados.</p>
          <p className="mb-0">Hecho con cariño para viajeros curiosos.</p>
        </div>
      </div>
    </footer>
  );
}
