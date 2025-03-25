// ProtectedRoute.jsx
import { useAuth } from '../middleware/authContext.jsx';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // Si no está autenticado, redirige a la ruta de login
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Opcional: Validar roles si se requieren restricciones adicionales
  if (allowedRoles && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;
