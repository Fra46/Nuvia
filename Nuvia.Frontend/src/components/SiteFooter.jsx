import React from 'react';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <h3>Nuvia</h3>
          <p>Vuelos, hoteles, tours y paquetes seleccionados a mano. Tu próximo viaje empieza aquí.</p>
        </div>

        <div>
          <h4>Explora</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/flights">Vuelos</a></li>
            <li><a href="/hotels">Hoteles</a></li>
            <li><a href="/tours">Tours</a></li>
            <li><a href="/packages">Paquetes</a></li>
          </ul>
        </div>

        <div>
          <h4>Contacto</h4>
          <p>info@viajesnuvia.com</p>
          <p>+57 313 656 9828</p>
          <p>Valledupar, Cesar, Colombia</p>
        </div>
      </div>
    </footer>
  );
}
