import { create } from 'zustand';
import { ToastT } from './Toast';

type StateToastT = {
  toasts: ToastT[];
};

type ActionsToastT = {
  addToast: (toast: ToastT) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};

export type UseToastStoreT = StateToastT & ActionsToastT;

export const useToastStore = create<StateToastT & ActionsToastT>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => {
      const { toasts } = state;
      toast.id = crypto.randomUUID();
      return { toasts: [...toasts, toast] };
    }),
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}));
