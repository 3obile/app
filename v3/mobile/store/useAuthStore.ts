import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  user: any | null;
  token: string | null;
  setAuth: (user: any, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: async (user, token) => {
    await AsyncStorage.setItem('access_token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  logout: async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('user');
    set({ user: null, token: null });
  },
  loadAuth: async () => {
    const token = await AsyncStorage.getItem('access_token');
    const userJson = await AsyncStorage.getItem('user');
    if (token && userJson) {
      set({ token, user: JSON.parse(userJson) });
    }
  },
}));
