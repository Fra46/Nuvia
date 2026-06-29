import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import cartsService from '../services/cartsService';
import { getCartPayload, hydrateCartItem } from '../data/productHelpers';

const CartContext = createContext(null);
const STORAGE_KEY = 'nuvia-cart';

function loadGuestCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('No se pudo cargar el carrito desde localStorage', error);
    return [];
  }
}

function saveGuestCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('No se pudo guardar el carrito en localStorage', error);
  }
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);

  const mergeGuestCartToServer = async (guestItems) => {
    if (!guestItems?.length) return;

    const tasks = guestItems.map(async (item) => {
      const payload = getCartPayload(item, item.quantity);
      if (!payload) return;
      try {
        await cartsService.addItem(payload);
      } catch (error) {
        console.warn('No se pudo migrar el item del carrito de invitado:', item, error);
      }
    });

    await Promise.all(tasks);
    localStorage.removeItem(STORAGE_KEY);
  };

  const loadCart = async () => {
    if (!isAuthenticated) {
      setItems(loadGuestCart());
      setHydrated(true);
      return;
    }

    setLoading(true);
    try {
      const guestItems = loadGuestCart();
      if (guestItems.length) {
        await mergeGuestCartToServer(guestItems);
      }

      const serverItems = await cartsService.getMyCart();
      setItems(serverItems.map(hydrateCartItem));
    } catch (error) {
      console.warn('No se pudo cargar el carrito del servidor', error);
      setItems([]);
    } finally {
      setLoading(false);
      setHydrated(true);
    }
  };

  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!hydrated || isAuthenticated) return;
    saveGuestCart(items);
  }, [items, hydrated, isAuthenticated]);

  const refreshCart = async () => {
    await loadCart();
  };

  const add = async (product) => {
    if (!product) return;

    if (isAuthenticated) {
      const payload = getCartPayload(product, product.quantity || 1);
      if (!payload) return;

      try {
        await cartsService.addItem(payload);
        await loadCart();
      } catch (error) {
        console.warn('No se pudo agregar el producto al carrito', error);
      }
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1, totalPrice: product.price }];
    });
  };

  const setQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      await remove(id);
      return;
    }

    if (isAuthenticated) {
      try {
        await cartsService.updateItem(id, { quantity });
        await loadCart();
      } catch (error) {
        console.warn('No se pudo actualizar la cantidad del carrito', error);
      }
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity, totalPrice: item.price * quantity } : item,
      ),
    );
  };

  const remove = async (id) => {
    if (isAuthenticated) {
      try {
        await cartsService.removeItem(id);
        await loadCart();
      } catch (error) {
        console.warn('No se pudo eliminar el item del carrito', error);
      }
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clear = async () => {
    if (isAuthenticated) {
      try {
        await cartsService.clear();
        await loadCart();
      } catch (error) {
        console.warn('No se pudo vaciar el carrito', error);
      }
      return;
    }

    setItems([]);
  };

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const iva = subtotal * 0.19;

    return {
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      iva,
      total: subtotal + iva,
      loading,
      refreshCart,
      add,
      remove,
      setQuantity,
      clear,
    };
  }, [items, loading]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
