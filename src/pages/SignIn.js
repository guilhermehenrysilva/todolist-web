import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Toast from '../components/Toast';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';


export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useAuth();

  // Login OAuth2
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');

    if (tokenParam) {
      setIsLoading(true);
      setToken(tokenParam);
      localStorage.setItem('token', tokenParam);
      setToast({ message: 'Login successful!', type: 'success' });

      setTimeout(() => {
        navigate('/annotations');
      }, 2000);
    }
  }, [setToken, navigate]);

  // Login API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/sign-in', { email, password });
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setToast({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        navigate('/annotations');
      }, 1000);
    } catch (error) {
      setToast({
        message: 'Invalid credentials. Please try again.',
        type: 'error',
      });
      setEmail('');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 mx-auto"></div>
          <p className="text-xl">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="mb-6 text-center flex items-center">
        <h1 className="text-4xl font-bold text-blue-500 flex items-center gap-2">
          TodoList
          <FontAwesomeIcon icon={faPencilAlt} />
        </h1>
      </div>
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
          >
            Sign In
          </button>
        </form>

        <div className="space-y-4">
          <Link
            to="/sign-up"
            className="block w-full bg-green-500 text-white p-2 rounded text-center hover:bg-green-600"
          >
            Create Account
          </Link>

          <a
            href="http://localhost:8080/oauth2/authorization/google"
            className="block w-full bg-red-500 text-white p-2 rounded text-center hover:bg-red-600 flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faGoogle} /> {/* Ícone do Google */}
            Sign in with Google
          </a>
        </div>
      </div>
    </div>
  );
}
