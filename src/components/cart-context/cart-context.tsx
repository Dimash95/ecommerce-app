import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode } from 'react';

interface CartContextType {
  totalQuantity: number;
  setTotalQuantity: Dispatch<SetStateAction<number>>;
}

interface CartProviderProps {
  children: ReactNode;
}

interface CartContextType {
  totalQuantity: number;
  setTotalQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [totalQuantity, setTotalQuantity] = useState(0);

  return <CartContext.Provider value={{ totalQuantity, setTotalQuantity }}>{children}</CartContext.Provider>;
};
