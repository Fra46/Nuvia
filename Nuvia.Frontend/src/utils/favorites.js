const FAVORITES_STORAGE_KEY = 'nuvia-favorites';

export function getStoredFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFavorites(items) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
}

export function isFavorite(productId) {
  return getStoredFavorites().some((item) => item.id === productId);
}

export function toggleFavorite(product) {
  if (!product) return getStoredFavorites();

  const items = getStoredFavorites();
  const exists = items.some((item) => item.id === product.id);
  const nextItems = exists
    ? items.filter((item) => item.id !== product.id)
    : [...items, { id: product.id, name: product.name, category: product.category, image: product.image, price: product.price, location: product.location }];

  saveFavorites(nextItems);
  return nextItems;
}
