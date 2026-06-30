import React from 'react';
import { Eye, Mail, MapPin, Phone } from 'lucide-react';

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

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__brand-block">
          <div className="site-footer__brand-header">
            <span className="site-footer__brand-icon">
              <Eye size={20} />
            </span>
            <span className="site-footer__brand-title">Nuvia</span>
          </div>
          <p className="site-footer__brand-copy">
            Vuelos, hoteles, tours y paquetes seleccionados a mano. Tu próximo viaje empieza aquí.
          </p>
          <div className="site-footer__socials">
            {socials.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="site-footer__social-button"
              >
                <svg viewBox="0 0 24 24" className="site-footer__social-icon" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {social.path}
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer__column">
          <h4>Explora</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/flights">Vuelos</a></li>
            <li><a href="/hotels">Hoteles</a></li>
            <li><a href="/tours">Tours</a></li>
            <li><a href="/packages">Paquetes</a></li>
          </ul>
        </div>

        <div className="site-footer__column">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Términos de servicio</a></li>
            <li><a href="#">Política de privacidad</a></li>
            <li><a href="#">Configuración de cookies</a></li>
          </ul>
        </div>

        <div className="site-footer__column">
          <h4>Contacto</h4>
          <ul className="site-footer__contact-list">
            <li>
              <Mail className="site-footer__contact-icon" />
              info@viajesnuvia.com
            </li>
            <li>
              <Phone className="site-footer__contact-icon" />
              +57 313 656 9828
            </li>
            <li>
              <MapPin className="site-footer__contact-icon" />
              Valledupar, Cesar, Colombia
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom-row">
        <p>© 2025 Nuvia. Todos los derechos reservados.</p>
        <p>Hecho con cariño para viajeros curiosos.</p>
      </div>
    </footer>
  );
}
