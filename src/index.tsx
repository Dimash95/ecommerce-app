import './assets/styles/common.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './utils/store-user-login';
import { CartProvider } from './components/cart-context';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Provider store={store}>
    <CartProvider>
      <AppRouter />
    </CartProvider>
  </Provider>
);

reportWebVitals();
