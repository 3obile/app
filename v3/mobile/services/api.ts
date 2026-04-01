import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '@/constants/Config';

const API_URL = `${Config.apiUrl}/api/v3`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
