import React from 'react';
import { Outlet } from 'react-router';

import Header from '../header';
import Footer from '../footer';
import Breadcrumbs from '../../components/breadcrumbs';

const Layout = () => {
  return (
    <div>
      <Header />
      <Breadcrumbs />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
