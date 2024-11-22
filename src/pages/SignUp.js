import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import api from '../services/api';
import Toast from '../components/Toast';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificação de campos vazios ou contendo apenas espaços
    if (!name.trim() || !email.trim() || !password.trim()) {
      setToast({
        message: 'All fields are required and must not contain only spaces.',
        type: 'error',
      });
      return;
    }

    try {
      await api.post('/sign-up', { name: name.trim(), email: email.trim(), password: password.trim() });
      setToast({ message: 'Registration successful!', type: 'success' });
      setTimeout(() => {
        navigate('/sign-in');
      }, 1000);
    } catch (error) {
      setName('');
      setEmail('');
      setPassword('');
      setToast({
        message: error.response?.data || 'An error occurred during registration.',
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Logo com Texto */}
      <div className="mb-6 text-center flex items-center justify-center gap-2">
        <h1 className="text-4xl font-bold text-blue-500 flex items-center gap-2">
          TodoList
          <FontAwesomeIcon icon={faPencilAlt} />
        </h1>
      </div>

      {/* Formulário */}
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
            Sign Up
          </button>
        </form>
        <Link
          to="/sign-in"
          className="block w-full bg-gray-500 text-white p-2 rounded text-center hover:bg-gray-600"
        >
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}
