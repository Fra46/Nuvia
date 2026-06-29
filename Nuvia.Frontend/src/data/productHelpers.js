export const categoryLabels = {
  vuelo: 'Vuelo',
  hotel: 'Hotel',
  tour: 'Tour',
  paquete: 'Paquete',
};

export const destinations = [
  'Cartagena',
  'Medellín',
  'Bogotá',
  'San Andrés',
  'Leticia',
  'Santa Marta',
];

export const heroImages = {
  home: '/images/hero-home.png',
  flights: '/images/hero-flights.png',
  hotels: '/images/hero-hotels.png',
  tours: '/images/hero-tours.png',
  packages: '/images/hero-packages.png',
};

const destinationImages = {
  cartagena: '/images/cartagena.png',
  sanandres: '/images/sanandres.png',
  guatape: '/images/guatape.png',
  leticia: '/images/leticia.png',
  santamarta: '/images/santamarta.png',
  amazonas: '/images/tour-amazonas.png',
  salento: '/images/hotel-salento.png',
};

const categoryImages = {
  vuelo: '/images/hero-flights.png',
  hotel: '/images/hero-hotels.png',
  tour: '/images/hero-tours.png',
  paquete: '/images/hero-packages.png',
};

const categoryToItemType = {
  vuelo: 1,
  hotel: 2,
  tour: 3,
  paquete: 4,
};

const cartTypeToCategory = {
  1: 'vuelo',
  2: 'hotel',
  3: 'tour',
  4: 'paquete',
};

const fallbackImage = '/images/hero-home.png';

export const formatCOP = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);

export function resolveProductImage(category, key, fallbackName) {
  if (!key) {
    return categoryImages[category] || fallbackImage;
  }

  const normalized = key.toString().toLowerCase().replace(/[^a-z0-9]+/g, '');
  return destinationImages[normalized] || categoryImages[category] || fallbackImage;
}

export function mapFlightDto(flight) {
  const departure = flight.departureTime ? new Date(flight.departureTime) : null;
  const formattedDeparture = departure
    ? departure.toLocaleString('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '';

  return {
    id: flight.id,
    category: 'vuelo',
    name: `${flight.airline} ${flight.flightCode}`,
    description: flight.isActive ? 'Vuelo disponible' : 'Vuelo no disponible',
    location: `${flight.origin} → ${flight.destination}`,
    destinationKey: flight.destination?.toLowerCase() ?? '',
    image: resolveProductImage('vuelo', flight.destination, flight.airline),
    price: flight.price,
    meta: formattedDeparture ? `Salida ${formattedDeparture}` : 'Horario disponible',
    availableSeats: flight.availableSeats,
    isActive: flight.isActive,
    rating: 4.8,
    reviews: 124,
  };
}

export function mapHotelDto(hotel) {
  return {
    id: hotel.id,
    category: 'hotel',
    name: hotel.name,
    description: `Estadía en ${hotel.city}, ${hotel.country}`,
    location: `${hotel.city}, ${hotel.country}`,
    destinationKey: hotel.city?.toLowerCase() ?? '',
    image: resolveProductImage('hotel', hotel.city, hotel.name),
    price: hotel.pricePerNight,
    meta: `${hotel.stars} estrellas · Por noche`,
    isActive: hotel.isActive,
    rating: 4.7,
    reviews: 98,
  };
}

export function mapTourDto(tour) {
  return {
    id: tour.id,
    category: 'tour',
    name: tour.name,
    description: tour.description || `Tour en ${tour.city}, ${tour.country}`,
    location: `${tour.city}, ${tour.country}`,
    destinationKey: tour.city?.toLowerCase() ?? '',
    image: resolveProductImage('tour', tour.city, tour.name),
    price: tour.pricePerPerson,
    meta: `${tour.durationHours}h · ${tour.availableSlots} cupos`,
    isActive: tour.isActive,
    rating: 4.9,
    reviews: 76,
  };
}

export function mapPackageDto(pkg) {
  return {
    id: pkg.id,
    category: 'paquete',
    name: pkg.title,
    description: pkg.description || `Paquete a ${pkg.destination}`,
    location: pkg.destination,
    destinationKey: pkg.destination?.toLowerCase() ?? '',
    image: resolveProductImage('paquete', pkg.destination, pkg.title),
    price: pkg.totalPrice,
    meta: `${pkg.nights} noches`,
    isActive: pkg.isActive,
    rating: 4.6,
    reviews: 63,
  };
}

export function getCartImageByCategory(category) {
  return categoryImages[category] || fallbackImage;
}

export function mapCartType(itemType) {
  return cartTypeToCategory[itemType] || 'paquete';
}

export function getCartPayload(product, quantity = 1) {
  if (!product || !product.category || typeof product.id === 'undefined') {
    return null;
  }
  const itemType = categoryToItemType[product.category];
  if (!itemType) {
    return null;
  }

  const itemId = Number(product.id);
  if (Number.isNaN(itemId)) {
    return null;
  }

  return {
    itemType,
    itemId,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
  };
}

export function hydrateCartItem(dto) {
  const category = mapCartType(dto.itemType);
  return {
    id: dto.id,
    category,
    itemId: dto.itemId,
    itemType: dto.itemType,
    name: dto.itemName,
    itemName: dto.itemName,
    location: categoryLabels[category],
    image: getCartImageByCategory(category),
    price: dto.unitPrice,
    quantity: dto.quantity,
    totalPrice: dto.totalPrice ?? dto.unitPrice * dto.quantity,
    rating: 4.8,
    reviews: 0,
  };
}

export function getHeroImage(topic) {
  return heroImages[topic] || heroImages.home;
}
