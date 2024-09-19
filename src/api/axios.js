import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:2700',
    baseURL: 'https://instagram-be.vercel.app'

});

// Tambahkan interceptor untuk memperbarui header otorisasi sebelum setiap permintaan
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
