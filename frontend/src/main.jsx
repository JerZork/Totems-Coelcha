import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import ErrorPage from './Pages/Error404.jsx';
import Cuenta from './Pages/Cuenta.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/cuenta/:accessCode',
    element: <Cuenta />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);