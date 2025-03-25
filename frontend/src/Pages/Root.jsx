// Root.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../middleware/authContext';

const Root = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default Root;
