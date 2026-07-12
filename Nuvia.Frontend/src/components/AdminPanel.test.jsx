import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPanel from './AdminPanel';

describe('AdminPanel', () => {
  it('muestra el panel de administración con las secciones principales', () => {
    render(
      <MemoryRouter>
        <AdminPanel />
      </MemoryRouter>
    );

    expect(screen.getByText(/panel de administración/i)).toBeTruthy();
    expect(screen.getByText(/gestión de catálogo/i)).toBeTruthy();
    expect(screen.getByText(/reservas y pagos/i)).toBeTruthy();
    expect(screen.getByText(/gestión de usuarios/i)).toBeTruthy();
  });
});
