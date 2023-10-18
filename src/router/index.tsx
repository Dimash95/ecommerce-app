import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useCart } from '../components/cart-context';
import { getActiveCart } from '../api/carts/get-active-cart';

import router from './router';

function AppRoutes() {
  const { setTotalQuantity } = useCart();

  useEffect(() => {
    const initializeCart = async () => {
      const cart = await getActiveCart();
      const totalQuantity = cart.lineItems.reduce((sum, item) => sum + item.quantity, 0);
      setTotalQuantity(totalQuantity);
    };

    initializeCart();
  }, [setTotalQuantity]);

  return <RouterProvider router={router} />;
}

export default AppRoutes;
