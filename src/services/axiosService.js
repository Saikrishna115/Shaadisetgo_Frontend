import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://shaadisetgo-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include if your API uses cookies or needs credentials
});

export default instance;
