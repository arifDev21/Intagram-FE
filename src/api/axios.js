import axios from 'axios';
export const api = axios.create({
  //  baseURL: 'https://mock-api-ig2.glitch.me/',
  baseURL: 'http://localhost:2600',
  //  baseURL: 'http://103.181.182.209:8001/',

  headers: {
    Authorization: `Bearer ${localStorage.getItem('auth')}`,
  },
});
