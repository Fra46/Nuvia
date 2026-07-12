import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

function AuthStatus() {
  const { isAuthenticated } = useAuth();
  return <div>{isAuthenticated ? 'authenticated' : 'guest'}</div>;
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('actualiza el estado cuando cambia la sesión', async () => {
    localStorage.setItem('token', 'test-token');

    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>
    );

    expect(screen.getByText('authenticated')).toBeTruthy();

    act(() => {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:changed'));
    });

    expect(await screen.findByText('guest')).toBeTruthy();
  });
});
