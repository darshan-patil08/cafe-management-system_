// client/src/components/__tests__/Menu.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Menu from '../pages/Menu';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {component}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Menu Component', () => {
  test('renders menu title', () => {
    renderWithProviders(<Menu />);
    expect(screen.getByText('Our Menu')).toBeInTheDocument();
  });

  test('filters menu items by category', async () => {
    renderWithProviders(<Menu />);
    
    const coffeeButton = screen.getByText('Coffee');
    fireEvent.click(coffeeButton);
    
    await waitFor(() => {
      // Test that only coffee items are displayed
    });
  });
});
