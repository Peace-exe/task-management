import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photoURL: string;
  about: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }, false, 'setUser'),
        clearUser: () => set({ user: null }, false, 'clearUser'),
      }),
      { name: 'auth-store' }
    ),
    { name: 'AuthStore' }
  )
);

export default useAuthStore;