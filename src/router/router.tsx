import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Layout from '../components/layout';
import HomePage from '../pages/home';
import NotFoundPage from '../pages/not-found';
import CatalogPage from '../pages/catalog';
import CategoryPage from '../pages/category-page';
import ProductPage from '../pages/product';
import AboutPage from '../pages/about';
import Contacts from '../pages/contacts';
import RegisterPage from '../pages/register';
import AuthPage from '../pages/auth';
import CartPage from '../pages/cart';
import ProfilePage from '../pages/profile/profile-page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: 'catalog',
        element: <CatalogPage />,
      },
      {
        path: 'catalog/:categoryId',
        element: <CategoryPage />,
      },
      {
        path: 'catalog/:categoryId/:productId',
        element: <ProductPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contacts',
        element: <Contacts />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
