import { beforeEach, describe, expect, it } from 'vitest';
import { getStoredFavorites, isFavorite, toggleFavorite } from './favorites';

describe('favorites helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('agrega y elimina favoritos de forma persistente', () => {
    const product = { id: 42, name: 'Tour urbano' };

    expect(isFavorite(42)).toBe(false);
    expect(getStoredFavorites()).toEqual([]);

    toggleFavorite(product);
    expect(isFavorite(42)).toBe(true);
    expect(getStoredFavorites()).toEqual([{ id: 42, name: 'Tour urbano' }]);

    toggleFavorite(product);
    expect(isFavorite(42)).toBe(false);
    expect(getStoredFavorites()).toEqual([]);
  });
});
