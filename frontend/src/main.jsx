// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Pages/Root.jsx';
import Login from './Pages/login.jsx';
import Homedepagos from './Pages/HomePagos.jsx';
import LoginnroServicio from './Pages/loginNroServicio.jsx';
import Cuenta from './Pages/Cuenta.jsx';
import PagoConBoleta from './Pages/PagoConBoleta.jsx';
import ErrorPage from './Pages/Error404.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      // Ruta index para renderizar el Login por defecto
      {
        index: true,
        element: <Login />,
      },
      {
        path: 'home',
        element: (
          <ProtectedRoute>
            <Homedepagos />
          </ProtectedRoute>
        ),
      },
      {
        path: 'loginNroServicio',
        element: 
        <ProtectedRoute>
        <LoginnroServicio />
        </ProtectedRoute>,
      },
      {
        path: 'cuenta',
        element: (
          <ProtectedRoute>
            <Cuenta />
          </ProtectedRoute>
        ),
      },
      {
        path: 'pagoConBoleta',
        element: (
          <ProtectedRoute>
            <PagoConBoleta />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
