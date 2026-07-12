export const promotions = [
  {
    id: 1,
    title: 'Verano colombiano',
    subtitle: 'Descuentos en Cartagena, Santa Marta y San Andrés.',
    badge: 'Hasta 25% OFF',
    accent: 'amber',
  },
  {
    id: 2,
    title: 'Escapada de fin de semana',
    subtitle: 'Paquetes con alojamiento + tours desde $899.000.',
    badge: 'Reserva flexible',
    accent: 'teal',
  },
  {
    id: 3,
    title: 'Viaja con tu equipo',
    subtitle: 'Tarifas especiales para grupos y recorridos en familia.',
    badge: 'Grupos +4',
    accent: 'sand',
  },
];

export function getPromotionBanner() {
  return promotions[0];
}
