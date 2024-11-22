import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Annotations from './pages/Annotations';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/sign-in" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/annotations" element={
            <PrivateRoute>
              <Annotations />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/annotations" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}