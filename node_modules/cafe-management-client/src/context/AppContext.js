import { createContext, useContext } from 'react';

export const AppContext = createContext();
export const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}
