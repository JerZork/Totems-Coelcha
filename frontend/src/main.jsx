import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginnroServicio from './Pages/loginNroServicio.jsx';
import ErrorPage from './Pages/Error404.jsx';
import Cuenta from './Pages/Cuenta.jsx';
import PagoConBoleta from './Pages/PagoConBoleta.jsx';
import Homedepagos from './Pages/HomePagos.jsx';
import Login from './Pages/login.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/home',
    element: <Homedepagos />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/loginNroServicio',
    element: <LoginnroServicio />,
  },
  {
    path: '/cuenta/',
    element: <Cuenta />,
  },
  {
    path: '/pagoConBoleta',
    element: <PagoConBoleta />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);