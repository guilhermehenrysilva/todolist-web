import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const UserAvatar = ({ user }) => {
  if (!user) return null;

  const getInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center mr-3">
      {user.photoUrl ? (
        <img
          src={user.photoUrl}
          alt={`${user.name}'s avatar`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          {getInitial(user.name)}
        </div>
      )}
    </div>
  );
};

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data } = await api.get('/me');
        setUser(data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const { logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <UserAvatar user={user} />
          {user && (
            <p className="text-gray-700">
              Welcome <span className="font-semibold">{user.name}</span> - {user.email}
            </p>
          )}
        </div>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}