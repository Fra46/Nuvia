import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import usersService from '../services/usersService';

vi.mock('../services/usersService', () => ({
  default: {
    getMe: vi.fn(),
  },
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra la información del perfil del usuario autenticado', async () => {
    usersService.getMe.mockResolvedValue({
      fullName: 'Ana Torres',
      email: 'ana@example.com',
      role: 'Customer',
      phoneNumber: '3001234567',
      isActive: true,
      emailVerified: true,
    });

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/mi perfil/i)).toBeTruthy();
    expect(screen.getByText(/ana torres/i)).toBeTruthy();
    expect(screen.getAllByText(/ana@example.com/i).length).toBeGreaterThan(0);
  });
});
