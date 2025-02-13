import '../styles/Home.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logoCoelcha.png";
import { BsExclamationCircle } from "react-icons/bs";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/login', { username, password });
      if (response.status === 200) {
        // Guardar el response en sessionStorage
        sessionStorage.setItem('user', JSON.stringify(response.data));
        navigate('/home');
      }
    } catch (error) {
      setLoginError('Login failed');
    }
  };

  const isFormValid = username && password;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0072ce] to-[#003087] flex items-center justify-center p-4" style={{ height: "1802px", width: "1080px" }}>
      <div className="w-[900px] h-[1350px] bg-white rounded-xl shadow-lg p-12 space-y-8 border-t-4 border-yellow-400">
        <header>
          <img src={logo} alt="Logo" />
        </header>
        <div className="text-center mb-8">
          <h1 className="text-8xl font-bold text-blue-900">Iniciar Sesión</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16 py-20">
          <div>
            <label className="block text-5xl font-medium text-blue-900 mb-3">
              Nombre de Usuario
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-6 py-4 text-5xl border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.username ? "border-red-500" : "border-yellow-300"}`}
                placeholder="Usuario"
              />
              {errors.username && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500">
                  <BsExclamationCircle size={28} />
                </div>
              )}
            </div>
            {errors.username && <p className="mt-2 text-red-500 text-lg">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-5xl font-medium text-blue-900 mb-3">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-6 py-4 text-5xl border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? "border-red-500" : "border-yellow-300"}`}
                placeholder="Contraseña"
              />
              {errors.password && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500">
                  <BsExclamationCircle size={28} />
                </div>
              )}
            </div>
            {errors.password && <p className="mt-2 text-red-500 text-lg">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 text-5xl font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700"
            disabled={!isFormValid}
          >
            Ingresar
          </button>
          {loginError && <p className="mt-2 text-red-500 text-lg">{loginError}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;