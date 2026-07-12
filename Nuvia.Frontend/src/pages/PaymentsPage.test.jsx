import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PaymentsPage from './PaymentsPage';
import paymentsService from '../services/paymentsService';

vi.mock('../services/paymentsService', () => ({
  default: {
    getMyPayments: vi.fn(),
  },
}));

describe('PaymentsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra el historial de pagos del usuario autenticado', async () => {
    paymentsService.getMyPayments.mockResolvedValue([
      {
        id: 10,
        bookingId: 3,
        amount: 250000,
        status: 2,
        method: 2,
        createdAt: '2026-07-10T12:00:00Z',
      },
    ]);

    render(
      <MemoryRouter>
        <PaymentsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/historial de pagos/i)).toBeTruthy();
    expect(screen.getByText(/\$\s*250\.000/i)).toBeTruthy();
  });
});
