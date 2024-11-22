import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

//Interceptor - token header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Interceptor - invalid token or expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401)) {
      console.log('Session expired. Redirect to SignIn...')
      localStorage.removeItem('token');
      setTimeout(() => {
        window.location.href = '/sign-in';
      }, 1000);
    }
    return Promise.reject(error);
  }
);

export default api;