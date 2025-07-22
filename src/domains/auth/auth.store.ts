import { mdiAlert } from '@mdi/js';
import { StateCreator, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login, restoreLogin } from './auth.service';
import { LoginAuthT, UserAuthT } from './auth.type';
import { useToastStore } from '@/domains/toast';

type StateAuthT = {
  isAuth: boolean;
  token: string;
  user: UserAuthT;
  // Eliminado: stores: StoreT[];
  // Eliminado: currentStore: StoreT | null;
};

type ActionsAuthT = {
  setToken: (token: string) => void;
  setUser: (user: UserAuthT) => void;
  // Eliminado: setStores: (stores: StoreT[]) => void;
  // Eliminado: setCurrentStore: (store: StoreT) => void;
  login: (data: LoginAuthT) => void;
  auchInfo: () => void;
  logout: () => void;
};

const auchSlice: StateCreator<StateAuthT & ActionsAuthT> = (set) => {
  const { addToast } = useToastStore.getState();

  const handleLogin = async (data: LoginAuthT) => {
    try {
      const { isLogged, token, user } = await login(data);

      if (isLogged && token && user) {
        // Eliminado: const stores = await getStoresByUser(user.id);
        // Eliminado: const currentStore = stores[0];
        set({
          token,
          isAuth: true,
          user,
          // Eliminado: stores,
          // Eliminado: currentStore,
        });
        return;
      }
    } catch (error) {
      console.error(error);
      addToast({
        description: 'Problemas al iniciar sesión',
        color: 'warning',
        icon: mdiAlert,
      });
    }
  };

  const handleAuchInfo = async () => {
    try {
      const { isLogged, token, user } = await restoreLogin();

      if (isLogged && token && user) {
        // Eliminado: const stores = await getStoresByUser(user.id);
        // Eliminado: const currentStore = get().currentStore || stores[0];
        set({
          token,
          isAuth: true,
          user,
          // Eliminado: stores,
          // Eliminado: currentStore,
        });
        return;
      }

      handleLogout();
    } catch (error) {
      console.error(error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    set({
      token: '',
      user: null,
      isAuth: false,
    });
  };

  return {
    isAuth: false,
    token: '',
    user: null,
    // Eliminado: stores: [],
    // Eliminado: currentStore: null,
    settings: null,
    setToken: (token) => set({ token }),
    setUser: (user) => set({ user }),
    // Eliminado: setStores: (stores) => set({ stores }),
    // Eliminado: setCurrentStore: (store) => set({ currentStore: store }),
    login: handleLogin,
    auchInfo: handleAuchInfo,
    logout: handleLogout,
  };
};

export const useAuthStore = create(
  persist(auchSlice, {
    name: 'auth',
  })
);
